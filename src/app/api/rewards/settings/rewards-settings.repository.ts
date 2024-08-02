import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../common/bees-entity';
import { RequestMethod } from '../../common/request-method';
import { RewardsSettingsSearchQuery } from './rewards-settings-search.query';
import { BeesResponse } from '../../proxy/bees-response';
import { Observable } from 'rxjs';
import { RewardsSettingsSearchResponse } from './rewards-settings-search.response';
import {
  RewardsSettingMetaPayload,
  RewardsSettingPayload,
} from './payloads/rewards-setting.payload';
import { RouteUtils } from '../../../shared/routing/route-utils';

@Injectable({ providedIn: 'root' })
export class RewardsSettingsRepository {
  constructor(private proxyService: ProxyService) {}

  public searchSettings(
    query: RewardsSettingsSearchQuery,
    envId?: number,
  ): Observable<BeesResponse<RewardsSettingsSearchResponse>> {
    return this.proxyService.makeRequest<RewardsSettingsSearchResponse>({
      endpoint: Endpoints.BEES_REWARDS_SETTINGS_V1,
      entity: BeesEntity.REWARDS_SETTINGS,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesParams(),
    });
  }

  public upsertSetting(
    meta: RewardsSettingMetaPayload,
    setting: RewardsSettingPayload,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<BeesResponse<any>> {
    const url = RouteUtils.setPathParams(Endpoints.BEES_REWARDS_SETTING_V1, [
      meta.settingId,
      meta.type,
      meta.level,
      meta.tier,
    ]);

    return this.proxyService.makeRequest<any>({
      endpoint: url,
      entity: BeesEntity.REWARDS_SETTINGS,
      method: RequestMethod.PUT,
      targetEnv: envId,
      data: setting,
      authTokenOverride: authTokenOverride,
    });
  }
}
