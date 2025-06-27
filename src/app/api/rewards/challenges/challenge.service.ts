import { Injectable } from '@angular/core';
import { ChallengeRepository } from './challenge.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { ChallengesQuery, ChallengesQueryImpl } from './challenges-query';
import { ChallengesSearchResponse } from './challenges-search.response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { ChallengeMode } from './challenge-mode';

/**
 * @monaco
 */
export interface IChallengeService {
  searchChallenges(
    query: ChallengesQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<ChallengesSearchResponse>>;

  cancelChallenge(
    challengeId: string,
    tokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  newQuery(): ChallengesQuery;
}

@Injectable({ providedIn: 'root' })
export class ChallengeService implements IChallengeService {
  constructor(private repository: ChallengeRepository) {}

  public async searchChallenges(
    query: ChallengesQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<ChallengesSearchResponse>> {
    return new FieldErrorWrapper(() =>
      this.repository.searchChallenges(query, env?.id),
    ).execute();
  }

  public async cancelChallenge(
    challengeId: string,
    tokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return new FieldErrorWrapper(() =>
      this.repository.patchChallenge(
        challengeId,
        { mode: ChallengeMode.CANCELLED, id: challengeId },
        tokenOverride,
        env?.id,
      ),
    ).execute();
  }

  newQuery(): ChallengesQuery {
    return new ChallengesQueryImpl();
  }
}
