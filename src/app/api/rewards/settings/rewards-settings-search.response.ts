import { Pagination } from '../../../shared/util/page';
import { RewardsSettingType } from './enums/rewards-setting-type';
import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';

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
