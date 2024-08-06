import { Deal } from '../../../../api/deals/deal';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { DealsSearchQuery } from '../../../../api/deals/payloads/deals-search.query';

export class ShowDealDetailsDialogPayload {
  constructor(
    public deal: Deal,
    public query: DealsSearchQuery,
    public selectedEnv: CountryEnvironmentModel,
  ) {}
}
