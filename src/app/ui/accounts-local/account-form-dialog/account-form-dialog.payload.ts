import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';

export class AccountFormDialogPayload {
  public env: CountryEnvironmentModel;
  public account?: AccountV1;

  constructor(env: CountryEnvironmentModel, account: AccountV1) {
    this.env = env;
    this.account = account;
  }
}
