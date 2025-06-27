import { Pagination } from '../../../shared/util/page';
import { RewardsSettingType } from './enums/rewards-setting-type';
import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';
import { RewardsSettingCalculationType } from './enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from './enums/rewards-setting-earn-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface RewardsSettingsSearchResponse {
  content: RewardSetting[];
  pagination: Pagination;
}

export interface RewardSetting {
  settingId: string;
  type: RewardsSettingType;
  level: RewardsSettingLevel;
  tier: RewardsTierLevel;
  lastModified: string;
  benefitsBanner?: BenefitsBanner;
  hubHeader?: HubHeader;
  beesBank?: BeesBank;
  toggles?: RewardsToggles;
  enrollmentPage?: EnrollmentPage;
  termsAndConditions?: RewardsTermsAndConditions[];
  rules?: RewardsRule[];
  categories?: RewardsCategory[];
  filter?: RewardsFilter;
  modules?: RewardsModule[];

  // Default settings
  initialBalance?: number;
  redeemLimit?: number;
  earnLimit?: number;
  calculationType?: RewardsSettingCalculationType;
  freeGoodEnabled?: boolean;
  earnType?: RewardsSettingEarnType;
  pricePerPoint?: number;
  pricePerPointEnabled?: boolean;
}

export interface BenefitsBanner {
  bgColor: string;
  //TODO: More fields here
  content: BenefitsBannerContent;
  header: { title: string };
  translations: BenefitsBannerTranslation[];
}

export interface BenefitsBannerTranslation {
  languageId: string;
  header: { title: string };
  content: BenefitsBannerTranslationContent;
}

export interface BenefitsBannerTranslationContent {
  sections: BenefitsBannerTranslationContentSection[];
}

export interface BenefitsBannerTranslationContentSection {
  id: string;
  title: string;
  items: BenefitsBannerTranslationContentSectionItem[];
}

export interface BenefitsBannerTranslationContentSectionItem {
  id: string;
  text: string;
}

export interface BenefitsBannerContent {
  bgColor: string;
  sections: BenefitsBannerSection[];
}

export interface BenefitsBannerSection {
  id: string;
  title: string;
  items: BenefitsBannerSectionItem[];
  //TODO: More fields here
}

export interface BenefitsBannerSectionItem {
  id: string;
  position: number;
  text: string;
  //TODO: More fields here
}

export interface HubHeader {
  web: HubHeaderImagePair;
  android: HubHeaderImagePair;
  ios: HubHeaderImagePair;
}

export interface HubHeaderImagePair {
  image: string;
  icon: string;
}

export interface BeesBank {
  web: BeesBankImageUrlPair;
  ios: BeesBankImageUrlPair;
  android: BeesBankImageUrlPair;
}

export interface BeesBankImageUrlPair {
  imageUrl: string;
  linkUrl: string;
}

export interface RewardsToggles {
  acceptItemsCountMultiplier?: boolean;
  findItemBySku?: boolean;
  includeItemVariantsForEarning?: boolean;
  earningByRule?: boolean;
  payWithPointsEnabled?: boolean;
  pwpPartialRefund?: boolean;
  supportLegacyDtComboCreation?: boolean;
  displayOutOfStockProductsLast?: boolean;
}

export interface EnrollmentPage {
  //TODO: Define full object
  content: EnrollmentPageContent;
  footer: EnrollmentPageFooter;
  title: string;
  subtitle: string;
  translations: EnrollmentPageTranslation[];
}

export interface EnrollmentPageTranslation {
  languageId: string;
  title: string;
  subtitle: string;
  content: EnrollmentPageTranslationContent;
  footer: EnrollmentPageTranslationFooter;
}

export interface EnrollmentPageTranslationContent {
  items: EnrollmentPageTranslationContentItem[];
}

export interface EnrollmentPageTranslationContentItem {
  id: string;
  title: string;
  description: string;
}

export interface EnrollmentPageTranslationFooter {
  textButton: string;
}

export interface EnrollmentPageContent {
  //TODO: Define full object
  items: EnrollmentPageContentItem[];
}

export interface EnrollmentPageContentItem {
  //TODO: Define full object
  id: string;
  title: string;
  description: string;
}

export interface EnrollmentPageFooter {
  textButton: string;
  //TODO: Define full object
}

export interface RewardsTermsAndConditions {
  versionId: string;
  documentDate: string;
  startDate: string;
  documentURL: string;
  changeLog: string;
  lastModified: string;
  translations?: RewardsTermsAndConditionsTranslation[];
}

export interface RewardsTermsAndConditionsTranslation {
  languageId: string;
  documentURL: string;
}

export class RewardsTermsAndConditionsTranslationImpl
  implements RewardsTermsAndConditionsTranslation
{
  constructor(
    public languageId: string,
    public documentURL: string,
  ) {}
}

export interface RewardRuleItem {
  itemId: string;
  vendorItemId: string;
  vendorId: string;
  lastModified: string;
}

export interface RewardsRule {
  ruleId: string;
  categoryId: string;
  description: string;
  skus: string[];
  items: RewardRuleItem[];
  amountSpent: number;
  points: number;
  lastModified: string;
}

export interface RewardsCategoryBrand {
  brandId: string;
  title: string;
  image: string;
}

export interface RewardsCategory {
  //TODO: Define all fields
  categoryId: string;
  categoryIdWeb: string;
  storeId: string;
  description: string;
  buttonLabel: string;
  buttonName: string;
  image: string;
  title: string;
  titleClubB: string;
  subtitle: string;
  headerImage: string;
  headerImageClubB: string;
  position: number;
  brands: RewardsCategoryBrand[];
  translations: RewardsCategoryTranslation[];
}

export interface RewardsCategoryTranslation {
  languageId: string;
  title: string;
}

export class RewardsCategoryTranslationImpl
  implements RewardsCategoryTranslation
{
  constructor(
    public languageId: string,
    public title: string,
  ) {}
}

export interface RewardsInclusion {
  potential: string[];
  segment: string[];
  subsegment: string[];
  vendorIds: string[];
  groupIds: string[];
}

export interface RewardsExclusion {
  groupIds: string[];
}

export interface RewardsFilter {
  inclusion: RewardsInclusion;
  exclusion: RewardsExclusion;
}

export interface RewardsModule {
  type: string;
  title: string;
  subtitle: string;
  position: number;
  enabled: boolean;
  messages: any;
  translations?: RewardsModuleTranslation[];
}

export interface RewardsModuleTranslation {
  languageId: string;
  title: string;
  subtitle: string;
  messages: any;
}

export class RewardsModuleTranslationImpl implements RewardsModuleTranslation {
  languageId: string;
  title: string;
  subtitle: string;
  messages: any;

  constructor(
    languageId: string,
    title: string,
    subtitle: string,
    messages: any,
  ) {
    this.languageId = languageId;
    this.title = title;
    this.subtitle = subtitle;
    this.messages = messages;
  }
}
