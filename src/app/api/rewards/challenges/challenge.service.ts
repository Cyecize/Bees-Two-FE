import { Injectable } from '@angular/core';
import { ChallengeRepository } from './challenge.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { ChallengesQuery } from './challenges-query';
import { ChallengesSearchResponse } from './challenges-search.response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private repository: ChallengeRepository) {}

  public async searchChallenges(
    query: ChallengesQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<ChallengesSearchResponse>> {
    return new FieldErrorWrapper(() =>
      this.repository.searchChallenges(query, env?.id),
    ).execute();
  }
}
