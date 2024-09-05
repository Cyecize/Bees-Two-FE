import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../../proxy/bees-response';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../common/bees-entity';
import { RequestMethod } from '../../common/request-method';
import { SegmentationGroupQuery } from './segmentation-group.query';
import { SegmentationGroupModel } from './segmentation-group.model';
import { SegmentationGroupByAccountQuery } from './segmentation-group-by-account.query';
import { SegmentationGroupByAccountSearchResponse } from './segmentation-group-by-account.search-response';

@Injectable({ providedIn: 'root' })
export class SegmentationRepository {
  constructor(private proxyService: ProxyService) {}

  public searchGroups(
    query: SegmentationGroupQuery,
    envId?: number,
  ): Observable<BeesResponse<SegmentationGroupModel[]>> {
    return this.proxyService.makeRequest<SegmentationGroupModel[]>({
      endpoint: Endpoints.BEES_SEGMENTATION_GROUPS,
      entity: BeesEntity.SEGMENTATION,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesParams(),
    });
  }

  public searchGroupsByAccount(
    query: SegmentationGroupByAccountQuery,
    envId?: number,
  ): Observable<BeesResponse<SegmentationGroupByAccountSearchResponse>> {
    return this.proxyService.makeRequest<SegmentationGroupByAccountSearchResponse>(
      {
        endpoint: Endpoints.BEES_SEGMENTATION_ACCOUNT_GROUPS,
        entity: BeesEntity.SEGMENTATION,
        method: RequestMethod.GET,
        targetEnv: envId,
        queryParams: query.toBeesParams(),
      },
    );
  }
}
