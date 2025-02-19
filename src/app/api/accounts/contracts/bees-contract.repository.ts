import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../../proxy/bees-response';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../common/bees-entity';
import { RequestMethod } from '../../common/request-method';
import { BeesContractQuery } from './bees-contract.query';
import { PageWithPagination } from '../../../shared/util/page';
import { BeesContract } from './bees-contract';

@Injectable({ providedIn: 'root' })
export class BeesContractRepository {
  constructor(private proxyService: ProxyService) {}

  public searchContracts(
    query: BeesContractQuery,
    envId?: number,
  ): Observable<BeesResponse<PageWithPagination<BeesContract>>> {
    return this.proxyService.makeRequest<PageWithPagination<BeesContract>>({
      endpoint: Endpoints.CONTRACTS_V2,
      entity: BeesEntity.CONTRACTS,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }
}
