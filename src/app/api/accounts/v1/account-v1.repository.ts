import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../../proxy/bees-response';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../proxy/bees-entity';
import { RequestMethod } from '../../proxy/request-method';
import { AccountV1 } from './account-v1';
import { AccountV1SearchQuery } from './account-v1-search.query';

@Injectable({ providedIn: 'root' })
export class AccountV1Repository {
  constructor(private proxyService: ProxyService) {}

  public searchAccounts(
    query: AccountV1SearchQuery,
    envId?: number,
  ): Observable<BeesResponse<AccountV1[]>> {
    return this.proxyService.makeRequest<AccountV1[]>({
      endpoint: Endpoints.ACCOUNT_V1,
      entity: BeesEntity.ACCOUNT,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }
}
