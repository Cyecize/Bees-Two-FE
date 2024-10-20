import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Challenge } from '../../../api/rewards/challenges/challenge';

export class ShowChallengeDialogPayload {
  constructor(
    public challenge: Challenge,
    public selectedEnv: CountryEnvironmentModel,
  ) {}
}
