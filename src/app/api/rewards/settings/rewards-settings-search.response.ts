import { Pagination } from '../../../shared/util/page';
import { RewardsSettingType } from './rewards-setting-type';
import { RewardsSettingLevel } from './rewards-setting-level';
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
}
