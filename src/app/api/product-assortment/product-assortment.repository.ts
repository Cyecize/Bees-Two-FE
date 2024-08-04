import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { InclusionPayload } from './inclusion.payload';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { BeesEntity } from '../common/bees-entity';
import { Endpoints } from '../../shared/http/endpoints';
import { RequestMethod } from '../common/request-method';

@Injectable({ providedIn: 'root' })
export class ProductAssortmentRepository {
  constructor(private proxyService: ProxyService) {}

  public upsertInclusion(
    data: InclusionPayload,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<BeesResponse<any>>({
      entity: BeesEntity.PRODUCT_ASSORTMENT_INCLUSION,
      endpoint: Endpoints.PRODUCT_ASSORTMENT_INCLUSION_V4,
      method: RequestMethod.POST,
      targetEnv: envId,
      data: data,
    });
  }
}
