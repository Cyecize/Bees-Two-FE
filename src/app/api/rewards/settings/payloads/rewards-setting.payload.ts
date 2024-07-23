import { RewardsSettingCalculationType } from '../enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from '../enums/rewards-setting-earn-type';
import { RewardsSettingLevel } from '../enums/rewards-setting-level';
import { RewardsTierLevel } from '../../rewards-tier-level';
import { RewardsSettingType } from '../enums/rewards-setting-type';

export interface RewardsSettingMetaPayload {
  settingId: string;
  level: RewardsSettingLevel;
  tier: RewardsTierLevel;
  type: RewardsSettingType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RewardsSettingPayload {}

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

export interface ImageAndIcon {
  image: string;
  icon: string;
}

export interface HubHeaderContainer {
  web: ImageAndIcon;
  android: ImageAndIcon;
  ios: ImageAndIcon;
}

export interface RewardsSettingHubHeaderPayload extends RewardsSettingPayload {
  hubHeader: HubHeaderContainer;
}

export interface RewardsSettingBenefitsBannerPayload
  extends RewardsSettingPayload {
  //TODO: Define this
  benefitsBanner: any;
}

export interface ImageAndLink {
  imageUrl: string;
  linkUrl: string;
}

export interface BeesBankContainer {
  web: ImageAndLink;
  android: ImageAndLink;
  ios: ImageAndLink;
}

export interface RewardsSettingBeesBankPayload extends RewardsSettingPayload {
  beesBank: BeesBankContainer;
}

export interface TogglesContainer {
  acceptItemsCountMultiplier: boolean | null;
  findItemBySku: boolean | null;
  includeItemVariantsForEarning: boolean | null;
  earningByRule: boolean | null;
  payWithPointsEnabled: boolean | null;
  pwpPartialRefund: boolean | null;
  supportLegacyDtComboCreation: boolean | null;
}

export interface RewardsSettingsTogglesPayload extends RewardsSettingPayload {
  toggles: TogglesContainer;
}

export interface EnrollmentPagePayloadContainer {
  content: any;
}

export interface RewardsSettingEnrollmentPagePayload
  extends RewardsSettingPayload {
  enrollmentPage: EnrollmentPagePayloadContainer;
}

export interface TermsAndConditionsContainer {
  versionId: string;
  documentDate?: string;
  startDate?: string;
  documentURL: string;
  changeLog: string;
  lastModified?: string;
}

export interface RewardsSettingTermsAndConditionsPayload
  extends RewardsSettingPayload {
  termsAndConditions: TermsAndConditionsContainer[];
}

export interface RewardRuleItem {
  itemId: string;
  vendorItemId: string;
  vendorId: string;
  lastModified?: string;
}

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

export interface RewardsSettingRulesPayload extends RewardsSettingPayload {
  rules: RewardsRule[];
}

export interface RewardsCategoryBrand {
  brandId: string;
  title: string;
  image: string;
}

export interface RewardsCategory {
  //TODO: Define all fields
  categoryId: string;
  brands: RewardsCategoryBrand[];
}

export interface RewardsSettingCategoriesPayload extends RewardsSettingPayload {
  categories: RewardsCategory[];
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

export interface RewardsSettingFilterPayload extends RewardsSettingPayload {
  filter: RewardsFilter;
}
