import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ShowRewardSettingDialogPayload {
  constructor(
    public setting: RewardSetting,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
