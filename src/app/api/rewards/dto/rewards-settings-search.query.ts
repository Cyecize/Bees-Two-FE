import { RewardsSettingLevel } from '../rewards-setting-level';
import { RewardsTierLevel } from '../rewards-tier-level';
import { RewardsSettingType } from '../rewards-setting-type';
import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';

export interface RewardsSettingsSearchQuery {
  levels: RewardsSettingLevel[];
  page: PageRequest;
  tiers: RewardsTierLevel[];
  types: RewardsSettingType[];
  toBeesParams(): BeesParamPayload[];
}

export class RewardsSettingsSearchQueryImpl
  implements RewardsSettingsSearchQuery
{
  levels: RewardsSettingLevel[] = [];
  page: PageRequest = new PageRequestImpl();
  tiers: RewardsTierLevel[] = [];
  types: RewardsSettingType[] = [];
  toBeesParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(new BeesParamPayloadImpl('levels', this.levels.join(',')));
    result.push(...this.page.toBeesParams());
    result.push(new BeesParamPayloadImpl('tiers', this.tiers.join(',')));
    result.push(new BeesParamPayloadImpl('types', this.types.join(',')));

    return result;
  }
}
