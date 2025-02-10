import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class EnvPickerDialogResult {
  constructor(public readonly envs: CountryEnvironmentModel[]) {}
}
