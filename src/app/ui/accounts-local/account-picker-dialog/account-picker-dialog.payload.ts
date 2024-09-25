import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class AccountPickerDialogPayload {
  constructor(
    public readonly env: CountryEnvironmentModel,
    public readonly hideActions?: boolean,
  ) {}
}
