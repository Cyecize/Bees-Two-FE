import { BeesMultilanguageTransformerBase } from '../../proxy/bees-multilanguage-transformer';
import { BeesResponse } from '../../proxy/bees-response';
import { BeesResponsePerLanguage } from '../../proxy/bees-response-per-language';
import {
  RewardSetting,
  RewardsModuleTranslationImpl,
  RewardsSettingsSearchResponse,
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
          break;
        case RewardsSettingType.CATEGORIES:
          break;
        case RewardsSettingType.BENEFITS_BANNER:
          break;
        case RewardsSettingType.ENROLLMENT_PAGE:
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
}
