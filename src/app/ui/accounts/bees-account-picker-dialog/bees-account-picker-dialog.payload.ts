import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class BeesAccountPickerDialogPayload {
  constructor(public readonly env: CountryEnvironmentModel) {}
}
