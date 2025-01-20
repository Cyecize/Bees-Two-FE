import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { ProxyService } from '../proxy/proxy.service';
import { SingleItemPriceV3 } from './single-item-price-v3';
import { SingleItemPriceV3Query } from './single-item-price-v3.query';

@Injectable({ providedIn: 'root' })
export class PriceRepository {
  constructor(private proxyService: ProxyService) {}

  public getPrices(
    queries: SingleItemPriceV3Query[],
    envId?: number,
  ): Observable<BeesResponse<SingleItemPriceV3[]>> {
    return this.proxyService.makeRequest<SingleItemPriceV3[]>({
      endpoint: Endpoints.PRICE_SERVICE_V3,
      entity: BeesEntity.PRICES,
      method: RequestMethod.POST,
      targetEnv: envId,
      data: queries,
    });
  }
}
