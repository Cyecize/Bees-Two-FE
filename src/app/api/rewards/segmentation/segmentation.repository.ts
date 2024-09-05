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
import { RouteUtils } from '../../../shared/routing/route-utils';
import { SegmentationGroupByAccountModel } from './segmentation-group-by-account.model';

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

  public getGroupsByAccount(
    accountId: string,
    envId?: number,
  ): Observable<BeesResponse<SegmentationGroupByAccountModel>> {
    return this.proxyService.makeRequest<SegmentationGroupByAccountModel>({
      endpoint: RouteUtils.setPathParams(
        Endpoints.BEES_SEGMENTATION_ACCOUNT_GROUP,
        [accountId],
      ),
      entity: BeesEntity.SEGMENTATION,
      method: RequestMethod.GET,
      targetEnv: envId,
    });
  }

  public deleteGroup(
    groupId: string,
    authTokenOverride: string,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(Endpoints.BEES_SEGMENTATION_GROUP, [
        groupId,
      ]),
      entity: BeesEntity.SEGMENTATION,
      method: RequestMethod.DELETE,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
    });
  }

  public deleteAccountGroup(
    accountId: string,
    authTokenOverride: string,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(
        Endpoints.BEES_SEGMENTATION_ACCOUNT_GROUP,
        [accountId],
      ),
      entity: BeesEntity.SEGMENTATION,
      method: RequestMethod.DELETE,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
    });
  }

  public deleteGroupInAccountGroup(
    accountId: string,
    groupId: string,
    authTokenOverride: string,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(
        Endpoints.BEES_SEGMENTATION_ACCOUNT_GROUP_GROUP,
        [accountId, groupId],
      ),
      entity: BeesEntity.SEGMENTATION,
      method: RequestMethod.DELETE,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
    });
  }
}
