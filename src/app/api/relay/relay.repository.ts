import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { RelayPayload } from './relay.payload';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { RequestMethod } from '../common/request-method';
import { BeesParamPayload } from '../proxy/bees-param.payload';
import { BeesResponse } from '../proxy/bees-response';

@Injectable({ providedIn: 'root' })
export class RelayRepository {
  constructor(private proxyService: ProxyService) {}

  public call<T>(
    method: RequestMethod,
    data: RelayPayload,
    headers: BeesParamPayload[],
    targetEnvId?: number,
  ): Observable<BeesResponse<T>> {
    return this.proxyService.makeRequest<T>({
      endpoint: Endpoints.DATA_INGESTION,
      method: method,
      entity: data.entity,
      data: data,
      targetEnv: targetEnvId,
      headers: headers,
    });
  }
}
