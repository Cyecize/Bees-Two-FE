import { Injectable } from '@angular/core';
import { BeesResponse } from '../../proxy/bees-response';
import {
  RewardsSettingsSearchQuery,
  RewardsSettingsSearchQueryImpl,
} from './rewards-settings-search.query';
import { firstValueFrom } from 'rxjs';
import { RewardsSettingsRepository } from './rewards-settings.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  RewardSetting,
  RewardsSettingsSearchResponse,
} from './rewards-settings-search.response';
import { RewardsTierLevel } from '../rewards-tier-level';
import { RewardsSettingLevel } from './enums/rewards-setting-level';
import { RewardsSettingType } from './enums/rewards-setting-type';
import { RewardsSettingsFormOutput } from '../../../ui/rewards/rewards-settings-form/rewards-settings-form.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';

@Injectable({ providedIn: 'root' })
export class RewardsSettingsService {
  constructor(private repository: RewardsSettingsRepository) {}

  public async searchSettings(
    query: RewardsSettingsSearchQuery,
    env?: CountryEnvironmentModel,
    tokenOverride?: string,
  ): Promise<WrappedResponse<RewardsSettingsSearchResponse>> {
    return new FieldErrorWrapper(() =>
      this.repository.searchSettings(query, env?.id, tokenOverride),
    ).execute();
  }

  @ShowLoader()
  public async upsert(
    formOutput: RewardsSettingsFormOutput,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return await new FieldErrorWrapper(() =>
      this.repository.upsertSetting(
        formOutput.meta,
        formOutput.setting,
        formOutput.env?.id,
        formOutput.authTokenOverride,
      ),
    ).execute();
  }

  public async findById(
    settingId: string,
    tier: RewardsTierLevel,
    level: RewardsSettingLevel,
    type: RewardsSettingType,
    env?: CountryEnvironmentModel,
  ): Promise<RewardSetting | null> {
    const query: RewardsSettingsSearchQuery =
      new RewardsSettingsSearchQueryImpl();

    query.tiers.push(tier);
    query.levels.push(level);
    query.types.push(type);

    return await this.searchOne(settingId, query, env);
  }

  private async searchOne(
    settingId: string,
    query: RewardsSettingsSearchQuery,
    env?: CountryEnvironmentModel,
    page = 0,
    tokenOverride?: string,
  ): Promise<RewardSetting | null> {
    query.page.pageSize = 5;
    query.page.page = page;

    const resp = await firstValueFrom(
      this.repository.searchSettings(query, env?.id, tokenOverride),
    );

    if (resp.statusCode !== 200) {
      console.error(`Setting ${settingId} search did not return 200 status.`);
      return null;
    }

    const matchingSetting = resp.response.content.filter(
      (value) => value.settingId === settingId,
    );
    if (matchingSetting.length > 0) {
      return matchingSetting[0];
    }

    if (resp.response.pagination.page >= resp.response.pagination.totalPages) {
      console.error(`Setting ${settingId} not found.`);
      return null;
    }

    return await this.searchOne(settingId, query, env, page + 1);
  }
}
