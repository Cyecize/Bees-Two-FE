import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { ItemsSearchQuery } from './items-search.query';
import { ItemsSearchResponse } from './items-search.response';
import { ItemPayload } from './item.payload';
import { ItemsTransformer } from './items-transformer';

@Injectable({ providedIn: 'root' })
export class ItemRepository {
  constructor(private proxyService: ProxyService) {}

  public searchItems(
    query: ItemsSearchQuery,
    envId?: number,
  ): Observable<BeesResponse<ItemsSearchResponse>> {
    return this.proxyService.makeMultilanguageRequest<ItemsSearchResponse>(
      {
        endpoint: Endpoints.ITEMS_V2,
        entity: BeesEntity.ITEMS,
        method: RequestMethod.GET,
        targetEnv: envId,
        queryParams: query.toBeesQueryParams(),
      },
      new ItemsTransformer(),
    );
  }

  public upsertItems(
    data: ItemPayload[],
    envId?: number,
  ): Observable<BeesResponse<ItemsSearchResponse>> {
    return this.proxyService.makeRequest<ItemsSearchResponse>({
      endpoint: Endpoints.ITEMS_V2_RELAY,
      entity: BeesEntity.ITEMS,
      method: RequestMethod.PUT,
      targetEnv: envId,
      data: data,
    });
  }
}
