import { AccountV1 } from '../../../api/accounts/v1/account-v1';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ShowAccountDetailsDialogPayload {
  constructor(
    public account: AccountV1,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
