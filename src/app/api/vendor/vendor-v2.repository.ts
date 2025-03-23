import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { PageWithPagination } from '../../shared/util/page';
import { VendorV2 } from './vendor-v2';
import { VendorV2Query } from './vendor-v2.query';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesResponse } from '../proxy/bees-response';

@Injectable({ providedIn: 'root' })
export class VendorV2Repository {
  constructor(private proxyService: ProxyService) {}

  public searchVendors(
    query: VendorV2Query,
    envId?: number,
  ): Observable<BeesResponse<PageWithPagination<VendorV2>>> {
    return this.proxyService.makeRequest<PageWithPagination<VendorV2>>({
      endpoint: Endpoints.VENDORS_V2,
      method: RequestMethod.GET,
      entity: BeesEntity.VENDOR,
      headers: query.toBeesHeaderParams(),
      queryParams: query.toBeesQueryParams(),
      targetEnv: envId,
    });
  }
}
