import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { RelayPayload } from './relay.payload';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';
import { BeesResponse } from '../proxy/bees-response';

@Injectable({ providedIn: 'root' })
export class RelayRepository {
  constructor(private proxyService: ProxyService) {}

  public call<T>(
    method: RequestMethod,
    data: RelayPayload,
    headers: BeesParam[],
    targetEnvId?: number,
    templateId?: number,
    saveInHistory?: boolean,
  ): Observable<BeesResponse<T>> {
    return this.proxyService.makeRequest<T>({
      endpoint: Endpoints.DATA_INGESTION,
      method: method,
      entity: data.entity,
      data: data,
      targetEnv: targetEnvId,
      headers: headers,
      templateId: templateId,
      saveInHistory: saveInHistory,
    });
  }
}
