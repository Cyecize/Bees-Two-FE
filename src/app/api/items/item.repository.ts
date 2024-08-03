import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { ItemsSearchQuery } from './items-search.query';
import { ItemsSearchResponse } from './items-search.response';

@Injectable({ providedIn: 'root' })
export class ItemRepository {
  constructor(private proxyService: ProxyService) {}

  public searchItems(
    query: ItemsSearchQuery,
    envId?: number,
  ): Observable<BeesResponse<ItemsSearchResponse>> {
    return this.proxyService.makeRequest<ItemsSearchResponse>({
      endpoint: Endpoints.ITEMS_V2,
      entity: BeesEntity.ITEMS,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }
}
