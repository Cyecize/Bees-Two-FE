import { Injectable } from '@angular/core';
import { BeesResponse } from '../proxy/bees-response';
import { RewardsSettingsSearchQuery } from './dto/rewards-settings-search.query';
import { firstValueFrom } from 'rxjs';
import { RewardsSettingsRepository } from './rewards-settings.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';

@Injectable({ providedIn: 'root' })
export class RewardsSettingsService {
  constructor(private repository: RewardsSettingsRepository) {}

  public async searchSettings(
    query: RewardsSettingsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<any>> {
    return firstValueFrom(this.repository.searchSettings(query, env));
  }
}
