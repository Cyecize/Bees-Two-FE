import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../proxy/bees-entity';
import { RequestMethod } from '../proxy/request-method';
import { PromoSearchQuery } from './promo-search.query';
import { PromoSearchResponse } from './promo-search.response';

@Injectable({ providedIn: 'root' })
export class PromoRepository {
  constructor(private proxyService: ProxyService) {}

  public searchPromos(
    query: PromoSearchQuery,
    envId?: number,
  ): Observable<BeesResponse<PromoSearchResponse>> {
    return this.proxyService.makeRequest<PromoSearchResponse>({
      endpoint: Endpoints.PROMOTIONS_V3,
      entity: BeesEntity.PROMOTIONS,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesParams(),
    });
  }
}
