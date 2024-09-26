import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { DeliveryWindowPayload } from './delivery-window.payload';
import { Observable } from 'rxjs';
import { BeesResponse } from '../../proxy/bees-response';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../common/bees-entity';
import { RequestMethod } from '../../common/request-method';

@Injectable({ providedIn: 'root' })
export class DeliveryWindowRepository {
  constructor(private proxyService: ProxyService) {}

  public createDeliveryWindow(
    payload: DeliveryWindowPayload,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: Endpoints.DELIVERY_WINDOWS_V1,
      entity: BeesEntity.DELIVERY_WINDOWS,
      method: RequestMethod.POST,
      targetEnv: envId,
      data: payload,
    });
  }
}
