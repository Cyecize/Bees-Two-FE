import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { BeesContract } from '../../../api/accounts/contracts/bees-contract';

export class ShowContractDetailsDialogPayload {
  constructor(
    public contract: BeesContract,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
