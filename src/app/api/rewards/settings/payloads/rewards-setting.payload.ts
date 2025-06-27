import { RewardsSettingCalculationType } from '../enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from '../enums/rewards-setting-earn-type';
import { RewardsSettingLevel } from '../enums/rewards-setting-level';
import { RewardsTierLevel } from '../../rewards-tier-level';
import { RewardsSettingType } from '../enums/rewards-setting-type';

/**
 * @monaco
 */
export interface RewardsSettingMetaPayload {
  settingId: string;
  level: RewardsSettingLevel;
  tier: RewardsTierLevel;
  type: RewardsSettingType;
}

/**
 * @monaco
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RewardsSettingPayload {}

/**
 * @monaco
 */
export interface RewardsSettingDefaultConfigurationPayload
  extends RewardsSettingPayload {
  initialBalance: number;
  redeemLimit: number;
  earnLimit: number;
  calculationType: RewardsSettingCalculationType;
  freeGoodEnabled: boolean;
  earnType: RewardsSettingEarnType;
  pricePerPoint: number | null;
  pricePerPointEnabled: boolean | null;
}

/**
 * @monaco
 */
export interface ImageAndIcon {
  image: string;
  icon: string;
}

/**
 * @monaco
 */
export interface HubHeaderContainer {
  web: ImageAndIcon;
  android: ImageAndIcon;
  ios: ImageAndIcon;
}

/**
 * @monaco
 */
export interface RewardsSettingHubHeaderPayload extends RewardsSettingPayload {
  hubHeader: HubHeaderContainer;
}

/**
 * @monaco
 */
export interface RewardsSettingBenefitsBannerPayload
  extends RewardsSettingPayload {
  //TODO: Define this
  benefitsBanner: any;
}

/**
 * @monaco
 */
export interface ImageAndLink {
  imageUrl: string;
  linkUrl: string;
}

/**
 * @monaco
 */
export interface BeesBankContainer {
  web: ImageAndLink;
  android: ImageAndLink;
  ios: ImageAndLink;
}

/**
 * @monaco
 */
export interface RewardsSettingBeesBankPayload extends RewardsSettingPayload {
  beesBank: BeesBankContainer;
}

/**
 * @monaco
 */
export interface TogglesContainer {
  acceptItemsCountMultiplier: boolean | null;
  findItemBySku: boolean | null;
  includeItemVariantsForEarning: boolean | null;
  earningByRule: boolean | null;
  payWithPointsEnabled: boolean | null;
  pwpPartialRefund: boolean | null;
  supportLegacyDtComboCreation: boolean | null;
  displayOutOfStockProductsLast: boolean | null;
}

/**
 * @monaco
 */
export interface RewardsSettingsTogglesPayload extends RewardsSettingPayload {
  toggles: TogglesContainer;
}

/**
 * @monaco
 */
export interface EnrollmentPagePayloadContainer {
  content: any;
}

/**
 * @monaco
 */
export interface RewardsSettingEnrollmentPagePayload
  extends RewardsSettingPayload {
  enrollmentPage: EnrollmentPagePayloadContainer;
}

/**
 * @monaco
 */
export interface TermsAndConditionsContainer {
  versionId: string;
  documentDate?: string;
  startDate?: string;
  documentURL: string;
  changeLog: string;
  lastModified?: string;
}

/**
 * @monaco
 */
export interface RewardsSettingTermsAndConditionsPayload
  extends RewardsSettingPayload {
  termsAndConditions: TermsAndConditionsContainer[];
}

/**
 * @monaco
 */
export interface RewardRuleItem {
  itemId: string;
  vendorItemId: string;
  vendorId: string;
  lastModified?: string;
}

/**
 * @monaco
 */
export interface RewardsRule {
  ruleId: string;
  categoryId: string;
  description: string;
  skus: string[];
  items: RewardRuleItem[];
  amountSpent: number;
  points: number;
  lastModified?: string;
}

/**
 * @monaco
 */
export interface RewardsSettingRulesPayload extends RewardsSettingPayload {
  rules: RewardsRule[];
}

/**
 * @monaco
 */
export interface RewardsCategoryBrand {
  brandId: string;
  title: string;
  image: string;
}

/**
 * @monaco
 */
export interface RewardsCategory {
  //TODO: Define all fields
  categoryId: string;
  brands: RewardsCategoryBrand[];
}

/**
 * @monaco
 */
export interface RewardsSettingCategoriesPayload extends RewardsSettingPayload {
  categories: RewardsCategory[];
}

/**
 * @monaco
 */
export interface RewardsInclusion {
  potential: string[];
  segment: string[];
  subsegment: string[];
  vendorIds: string[];
  groupIds: string[];
}

/**
 * @monaco
 */
export interface RewardsExclusion {
  groupIds: string[];
}

/**
 * @monaco
 */
export interface RewardsFilter {
  inclusion: RewardsInclusion;
  exclusion: RewardsExclusion;
}

/**
 * @monaco
 */
export interface RewardsSettingFilterPayload extends RewardsSettingPayload {
  filter: RewardsFilter;
}
