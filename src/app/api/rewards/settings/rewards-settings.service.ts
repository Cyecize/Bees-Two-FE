import { Injectable } from '@angular/core';
import { BeesResponse } from '../../proxy/bees-response';
import { RewardsSettingsSearchQuery } from './rewards-settings-search.query';
import { firstValueFrom } from 'rxjs';
import { RewardsSettingsRepository } from './rewards-settings.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { RewardsSettingsSearchResponse } from './rewards-settings-search.response';

@Injectable({ providedIn: 'root' })
export class RewardsSettingsService {
  constructor(private repository: RewardsSettingsRepository) {}

  public async searchSettings(
    query: RewardsSettingsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<RewardsSettingsSearchResponse>> {
    return firstValueFrom(this.repository.searchSettings(query, env));
  }
}
