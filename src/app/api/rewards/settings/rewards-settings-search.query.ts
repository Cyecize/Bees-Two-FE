import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';
import { RewardsSettingType } from './enums/rewards-setting-type';
import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';

export interface RewardsSettingsSearchQuery {
  levels: RewardsSettingLevel[];
  page: PageRequest;
  tiers: RewardsTierLevel[];
  types: RewardsSettingType[];
  toBeesParams(): BeesParam[];
}

export class RewardsSettingsSearchQueryImpl
  implements RewardsSettingsSearchQuery
{
  levels: RewardsSettingLevel[] = [];
  page: PageRequest = new PageRequestImpl();
  tiers: RewardsTierLevel[] = [];
  types: RewardsSettingType[] = [];
  toBeesParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(new BeesParamImpl('levels', this.levels.join(',')));
    result.push(...this.page.toBeesParams());
    result.push(new BeesParamImpl('tiers', this.tiers.join(',')));
    result.push(new BeesParamImpl('types', this.types.join(',')));

    return result;
  }
}
