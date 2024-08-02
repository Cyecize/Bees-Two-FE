import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { ProxyService } from '../proxy/proxy.service';
import { DealsSearchQuery } from './deals-search.query';
import { DealsSearchResponse } from './deals-search.response';

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
}
