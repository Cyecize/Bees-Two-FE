import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { InventoryQuery } from './dto/inventory.query';
import { InventoriesResponse } from './dto/inventories.response';

@Injectable({ providedIn: 'root' })
export class InventoryRepository {
  constructor(private proxyService: ProxyService) {}

  public searchStock(
    query: InventoryQuery,
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
}
