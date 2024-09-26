import { Pagination } from '../../../shared/util/page';
import { RewardsSettingType } from './enums/rewards-setting-type';
import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';
import { RewardsSettingCalculationType } from './enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from './enums/rewards-setting-earn-type';

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
}

export interface BenefitsBannerContent {
  bgColor: string;
  sections: BenefitsBannerSection[];
}

export interface BenefitsBannerSection {
  id: string;
  items: BenefitsBannerSectionItem[];
  //TODO: More fields here
}

export interface BenefitsBannerSectionItem {
  id: string;
  position: number;
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
}

export interface EnrollmentPageContent {
  //TODO: Define full object
  items: EnrollmentPageContentItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnrollmentPageContentItem {
  //TODO: Define full object
}

export interface RewardsTermsAndConditions {
  versionId: string;
  documentDate: string;
  startDate: string;
  documentURL: string;
  changeLog: string;
  lastModified: string;
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
  brands: RewardsCategoryBrand[];
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
