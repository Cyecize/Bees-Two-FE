import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { PromoSearchQuery } from './promo-search.query';
import { PromoSearchResponse } from './promo-search.response';
import { BeesParamImpl } from '../common/bees-param';

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

  public deletePromo(
    vendorPromotionIds: string[],
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<BeesResponse<any>>({
      endpoint: Endpoints.PROMOTION_RELAY_V3,
      entity: BeesEntity.PROMOTIONS,
      method: RequestMethod.DELETE,
      headers: [new BeesParamImpl('X-Timestamp', Date.now())],
      data: {
        vendorPromotionIds: vendorPromotionIds,
      },
      targetEnv: envId,
    });
  }
}
