import { BeesMultilanguageTransformerBase } from '../../proxy/bees-multilanguage-transformer';
import { BeesResponse } from '../../proxy/bees-response';
import { BeesResponsePerLanguage } from '../../proxy/bees-response-per-language';
import {
  RewardsCategoryTranslationImpl,
  RewardSetting,
  RewardsModuleTranslationImpl,
  RewardsSettingsSearchResponse,
  RewardsTermsAndConditionsTranslationImpl,
} from './rewards-settings-search.response';
import { RewardsSettingType } from './enums/rewards-setting-type';

export class RewardsSettingsTransformer extends BeesMultilanguageTransformerBase<RewardsSettingsSearchResponse> {
  private readonly SUPPORTED_SETTINGS = [
    RewardsSettingType.TERMS,
    RewardsSettingType.CATEGORIES,
    RewardsSettingType.BENEFITS_BANNER,
    RewardsSettingType.ENROLLMENT_PAGE,
    RewardsSettingType.MODULES,
  ];

  doTransform(
    mainResponse: BeesResponsePerLanguage<RewardsSettingsSearchResponse>,
    otherLanguagesResponses: BeesResponsePerLanguage<RewardsSettingsSearchResponse>[],
  ): BeesResponse<RewardsSettingsSearchResponse> {
    for (const setting of mainResponse.beesResponse.response.content) {
      if (!this.SUPPORTED_SETTINGS.includes(setting.type)) {
        continue;
      }

      //Go through other languages and collect their settings
      const otherLanguageSettings: { setting: RewardSetting; lang: string }[] =
        [];
      for (const otherLangResponse of otherLanguagesResponses) {
        const otherLanguageSetting = this.findSetting(
          setting,
          otherLangResponse.beesResponse.response.content,
        );

        if (!otherLanguageSetting) {
          console.warn(
            `The following setting was not found for language ${otherLangResponse.languageCode}`,
            setting,
          );
          continue;
        }

        otherLanguageSettings.push({
          setting: otherLanguageSetting,
          lang: otherLangResponse.languageCode,
        });
      }

      if (otherLanguageSettings.length <= 0) {
        continue;
      }

      switch (setting.type) {
        case RewardsSettingType.TERMS:
          this.mergeTerms(
            setting,
            mainResponse.languageCode,
            otherLanguageSettings,
          );
          break;
        case RewardsSettingType.CATEGORIES:
          this.mergeCategories(
            setting,
            mainResponse.languageCode,
            otherLanguageSettings,
          );
          break;
        case RewardsSettingType.BENEFITS_BANNER:
          this.mergeBenefitsBanner(
            setting,
            mainResponse.languageCode,
            otherLanguageSettings,
          );
          break;
        case RewardsSettingType.ENROLLMENT_PAGE:
          this.mergeEnrollmentPage(
            setting,
            mainResponse.languageCode,
            otherLanguageSettings,
          );
          break;
        case RewardsSettingType.MODULES:
          this.mergeModules(
            setting,
            mainResponse.languageCode,
            otherLanguageSettings,
          );
          break;
        default:
          alert(`Cannot transform setting with type ${setting.type}!`);
          break;
      }
    }

    return mainResponse.beesResponse;
  }

  private findSetting(
    setting: RewardSetting,
    otherLanguageSettings: RewardSetting[],
  ): RewardSetting | undefined {
    return otherLanguageSettings.find(
      (rs) =>
        rs.settingId === setting.settingId &&
        rs.type === setting.type &&
        rs.tier === setting.tier &&
        rs.level === setting.level,
    );
  }

  private mergeModules(
    setting: RewardSetting,
    defaultLanguage: string,
    settings: { setting: RewardSetting; lang: string }[],
  ): void {
    setting.modules?.forEach((module) => {
      module.translations = [];
      module.translations.push(
        new RewardsModuleTranslationImpl(
          defaultLanguage,
          module.title,
          module.subtitle,
          module.messages,
        ),
      );

      for (const otherSetting of settings) {
        const otherModule = otherSetting.setting.modules?.find(
          (m) => m.type === module.type && m.position === module.position,
        );

        if (!otherModule) {
          alert(
            'Missing module translation (This should never happen! (Check console)',
          );
          console.warn(
            `Missing ${otherSetting.lang} version for module: `,
            module,
          );
          continue;
        }

        module.translations.push(
          new RewardsModuleTranslationImpl(
            otherSetting.lang,
            otherModule.title,
            otherModule.subtitle,
            otherModule.messages,
          ),
        );
      }
    });
  }

  private mergeTerms(
    setting: RewardSetting,
    defaultLanguage: string,
    settings: { setting: RewardSetting; lang: string }[],
  ): void {
    for (let i = 0; i < (setting.termsAndConditions?.length || 0); i++) {
      const term = setting.termsAndConditions![i];
      term.translations = [];
      term.translations.push(
        new RewardsTermsAndConditionsTranslationImpl(
          defaultLanguage,
          term.documentURL,
        ),
      );

      settings.forEach((setting) => {
        const otherTerm = setting.setting.termsAndConditions![i];
        term.translations!.push(
          new RewardsTermsAndConditionsTranslationImpl(
            setting.lang,
            otherTerm.documentURL,
          ),
        );
      });
    }
  }

  private mergeCategories(
    setting: RewardSetting,
    defaultLanguage: string,
    settings: { setting: RewardSetting; lang: string }[],
  ): void {
    for (let i = 0; i < (setting.categories?.length || 0); i++) {
      const category = setting.categories![i];
      category.translations = [];
      category.translations.push(
        new RewardsCategoryTranslationImpl(defaultLanguage, category.title),
      );

      settings.forEach((setting) => {
        const otherCat = setting.setting.categories!.find(
          (c) =>
            c.categoryId === category.categoryId &&
            c.categoryIdWeb === category.categoryIdWeb &&
            c.storeId === category.storeId,
        );

        if (!otherCat) {
          alert('no other cat (this should never happen!');
          return;
        }
        category.translations!.push(
          new RewardsCategoryTranslationImpl(setting.lang, otherCat.title),
        );
      });
    }
  }

  private mergeBenefitsBanner(
    setting: RewardSetting,
    defaultLanguage: string,
    settings: { setting: RewardSetting; lang: string }[],
  ): void {
    const banner = setting.benefitsBanner!;
    banner.translations = [];
    banner.translations.push({
      languageId: defaultLanguage,
      header: { title: banner.header.title },
      content: {
        sections: banner.content.sections.map((s) => {
          return {
            id: s.id,
            title: s.title,
            items: s.items.map((i) => {
              return {
                id: i.id,
                text: i.text,
              };
            }),
          };
        }),
      },
    });

    settings.forEach((setting) => {
      const otherBanner = setting.setting.benefitsBanner;

      if (!otherBanner) {
        alert('No other benefits banner (this should never happen!');
        return;
      }

      banner.translations.push({
        languageId: setting.lang,
        header: { title: otherBanner.header.title },
        content: {
          sections: otherBanner.content.sections.map((s) => {
            return {
              id: s.id,
              title: s.title,
              items: s.items.map((i) => {
                return {
                  id: i.id,
                  text: i.text,
                };
              }),
            };
          }),
        },
      });
    });
  }

  private mergeEnrollmentPage(
    setting: RewardSetting,
    defaultLanguage: string,
    settings: { setting: RewardSetting; lang: string }[],
  ): void {
    const enrollmentPage = setting.enrollmentPage!;
    enrollmentPage.translations = [];
    enrollmentPage.translations.push({
      languageId: defaultLanguage,
      title: enrollmentPage.title,
      subtitle: enrollmentPage.subtitle,
      content: {
        items: enrollmentPage.content.items.map((i) => {
          return {
            id: i.id,
            title: i.title,
            description: i.description,
          };
        }),
      },
      footer: {
        textButton: enrollmentPage.footer.textButton,
      },
    });

    settings.forEach((setting) => {
      const otherEnrollmentPage = setting.setting.enrollmentPage;

      if (!otherEnrollmentPage) {
        alert('No other enrollment page (this should never happen!');
        return;
      }

      enrollmentPage.translations.push({
        languageId: setting.lang,
        title: otherEnrollmentPage.title,
        subtitle: otherEnrollmentPage.subtitle,
        content: {
          items: otherEnrollmentPage.content.items.map((i) => {
            return {
              id: i.id,
              title: i.title,
              description: i.description,
            };
          }),
        },
        footer: {
          textButton: otherEnrollmentPage.footer.textButton,
        },
      });
    });
  }
}
