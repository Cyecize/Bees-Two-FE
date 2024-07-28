import { Deal } from '../../../../api/deals/deal';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';

export class ShowDealDetailsDialogPayload {
  constructor(
    public deal: Deal,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
