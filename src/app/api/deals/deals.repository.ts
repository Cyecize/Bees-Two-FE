import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { ProxyService } from '../proxy/proxy.service';
import { DealsSearchQuery } from './payloads/deals-search.query';
import { DealsSearchResponse } from './deals-search.response';
import { DeleteDealsPayload } from './payloads/delete-deals.payload';
import { BeesParamImpl } from '../common/bees-param';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { CreateDealsPayload } from './payloads/create-deals.payload';

@Injectable({ providedIn: 'root' })
export class DealsRepository {
  constructor(private proxyService: ProxyService) {}

  public searchDeals(
    query: DealsSearchQuery,
    envId?: number,
  ): Observable<BeesResponse<DealsSearchResponse>> {
    return this.proxyService.makeRequest<DealsSearchResponse>({
      endpoint: Endpoints.DEAL_SERVICE_V3,
      entity: BeesEntity.DEALS,
      method: RequestMethod.POST,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
      data: [query.body.sanitize()],
    });
  }

  public deleteDeals(
    payload: DeleteDealsPayload,
    env: CountryEnvironmentModel,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: Endpoints.DEAL_RELAY_V3,
      entity: BeesEntity.DEALS,
      method: RequestMethod.DELETE,
      targetEnv: env.id,
      data: payload,
      headers: [
        new BeesParamImpl('X-Timestamp', new Date().getTime()),
        new BeesParamImpl('Timezone', env.timezone),
      ],
    });
  }

  public upsert(
    payload: CreateDealsPayload,
    env: CountryEnvironmentModel,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: Endpoints.DEAL_RELAY_V3,
      entity: BeesEntity.DEALS,
      method: RequestMethod.PUT,
      targetEnv: env.id,
      data: payload,
      headers: [
        new BeesParamImpl('X-Timestamp', new Date().getTime()),
        new BeesParamImpl('Timezone', env.timezone),
      ],
    });
  }
}
