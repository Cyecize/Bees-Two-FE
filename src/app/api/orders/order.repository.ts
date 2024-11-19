import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { OrderQuery } from './dto/order.query';
import { OrderSearchResult } from './dto/order-search-result';

@Injectable({ providedIn: 'root' })
export class OrderRepository {
  constructor(private proxyService: ProxyService) {}

  public searchOrders(
    query: OrderQuery,
    envId?: number,
  ): Observable<BeesResponse<OrderSearchResult>> {
    return this.proxyService.makeRequest<OrderSearchResult>({
      endpoint: Endpoints.ORDER_SERVICE_ORDERS_V3,
      entity: BeesEntity.ORDERS,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }
}
