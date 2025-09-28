import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { InventoryV2Query } from './dto/inventory-v2.query';
import { InventoriesResponse } from './dto/inventories.response';
import { InventoryV1Query } from './dto/inventory-v1.query';
import { InventoryItemResponse } from './dto/inventory-item-response';

@Injectable({ providedIn: 'root' })
export class InventoryRepository {
  constructor(private proxyService: ProxyService) {}

  public searchStockV2(
    query: InventoryV2Query,
    envId?: number,
  ): Observable<BeesResponse<InventoriesResponse>> {
    return this.proxyService.makeRequest<InventoriesResponse>({
      endpoint: Endpoints.INVENTORY_V2,
      entity: BeesEntity.INVENTORY,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }

  public searchStockV1(
    query: InventoryV1Query,
    envId?: number,
  ): Observable<BeesResponse<InventoryItemResponse[]>> {
    return this.proxyService.makeRequest<InventoryItemResponse[]>({
      endpoint: Endpoints.INVENTORY,
      entity: BeesEntity.INVENTORY,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }
}
