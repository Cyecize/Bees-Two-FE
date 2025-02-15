import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { GrowOrganization } from './grow-organization';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { GrowOrganizationPayload } from './grow-organization.payload';
import { RouteUtils } from '../../shared/routing/route-utils';
import { GrowGroup } from './grow-group';
import { BeesParam, BeesParamImpl } from '../common/bees-param';
import { GrowGroupPayload } from './grow-group.payload';

@Injectable({ providedIn: 'root' })
export class GrowRepository {
  constructor(private proxyService: ProxyService) {}

  public searchOrganizations(
    userMail?: string,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<BeesResponse<GrowOrganization[]>> {
    return this.proxyService.makeRequest<GrowOrganization[]>({
      endpoint: Endpoints.GROW_ORGANIZATIONS,
      entity: BeesEntity.GROW,
      method: RequestMethod.GET,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
    });
  }

  public putOrganization(
    orgId: string,
    payload: GrowOrganizationPayload,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<any> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(Endpoints.GROW_ORGANIZATION, [orgId]),
      entity: BeesEntity.GROW,
      method: RequestMethod.PUT,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
      data: payload,
    });
  }

  public searchGroups(
    orgId: string,
    userEmail?: string,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<BeesResponse<GrowGroup[]>> {
    const queryParams: BeesParam[] = [];
    if (userEmail) {
      queryParams.push(new BeesParamImpl('userid', userEmail));
    }

    return this.proxyService.makeRequest<GrowGroup[]>({
      endpoint: RouteUtils.setPathParams(Endpoints.GROW_GROUPS, [orgId]),
      entity: BeesEntity.GROW,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: queryParams,
      authTokenOverride: authTokenOverride,
    });
  }

  public postGroup(
    orgId: string,
    payload: GrowGroupPayload,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<any> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(Endpoints.GROW_GROUPS, [orgId]),
      entity: BeesEntity.GROW,
      method: RequestMethod.POST,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
      data: payload,
    });
  }

  public putGroup(
    orgId: string,
    groupId: string,
    payload: GrowGroupPayload,
    envId?: number,
    authTokenOverride?: string,
  ): Observable<any> {
    return this.proxyService.makeRequest<any>({
      endpoint: RouteUtils.setPathParams(Endpoints.GROW_GROUP, {
        orgId: orgId,
        groupId: groupId,
      }),
      entity: BeesEntity.GROW,
      method: RequestMethod.PUT,
      targetEnv: envId,
      authTokenOverride: authTokenOverride,
      data: payload,
    });
  }
}
