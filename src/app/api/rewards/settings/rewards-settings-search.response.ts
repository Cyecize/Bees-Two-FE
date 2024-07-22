import { Pagination } from '../../../shared/util/page';
import { RewardsSettingType } from './enums/rewards-setting-type';
import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';
import { BeesBankContainer } from './payloads/rewards-setting.payload';

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
