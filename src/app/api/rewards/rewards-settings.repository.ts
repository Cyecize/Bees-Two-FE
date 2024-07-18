import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../proxy/bees-entity';
import { RequestMethod } from '../proxy/request-method';
import { RewardsSettingsSearchQuery } from './dto/rewards-settings-search.query';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesResponse } from '../proxy/bees-response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RewardsSettingsRepository {
  constructor(private proxyService: ProxyService) {}

  public searchSettings(
    query: RewardsSettingsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: Endpoints.BEES_REWARDS_SETTINGS_V1,
      entity: BeesEntity.REWARDS_SETTINGS,
      method: RequestMethod.GET,
      targetEnv: env?.id,
      queryParams: query.toBeesParams(),
    });
  }
}
