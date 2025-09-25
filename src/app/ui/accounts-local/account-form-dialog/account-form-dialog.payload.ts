import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';
import { BeesContract } from '../../../api/accounts/contracts/bees-contract';

export class AccountFormDialogPayload {
  public env: CountryEnvironmentModel;
  public account?: AccountV1 | BeesContract;

  constructor(env: CountryEnvironmentModel, account: AccountV1 | BeesContract) {
    this.env = env;
    this.account = account;
  }
}
