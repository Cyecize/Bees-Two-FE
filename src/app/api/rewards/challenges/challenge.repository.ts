import { Injectable } from '@angular/core';
import { ProxyService } from '../../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../../proxy/bees-response';
import { Endpoints } from '../../../shared/http/endpoints';
import { BeesEntity } from '../../common/bees-entity';
import { RequestMethod } from '../../common/request-method';
import { ChallengesSearchResponse } from './challenges-search.response';
import { ChallengesQuery } from './challenges-query';
import { RouteUtils } from '../../../shared/routing/route-utils';

@Injectable({ providedIn: 'root' })
export class ChallengeRepository {
  constructor(private proxyService: ProxyService) {}

  public searchChallenges(
    query: ChallengesQuery,
    envId?: number,
  ): Observable<BeesResponse<ChallengesSearchResponse>> {
    return this.proxyService.makeRequest<ChallengesSearchResponse>({
      endpoint: Endpoints.BEES_REWARDS_CHALLENGES_V2,
      entity: BeesEntity.CHALLENGES,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
    });
  }

  public patchChallenge(
    challengeId: string,
    body: any,
    tokenOverride: string,
    envId?: number,
  ): Observable<BeesResponse<any>> {
    return this.proxyService.makeRequest<ChallengesSearchResponse>({
      endpoint: RouteUtils.setPathParams(Endpoints.BEES_REWARDS_CHALLENGE_V1, [
        challengeId,
      ]),
      entity: BeesEntity.CHALLENGES,
      method: RequestMethod.PATCH,
      targetEnv: envId,
      authTokenOverride: tokenOverride,
      data: body,
    });
  }
}
