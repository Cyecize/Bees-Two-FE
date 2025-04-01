import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Promo } from '../../../../api/promo/promo';

export class ShowPromoDetailsDialogPayload {
  constructor(
    public promo: Promo,
    public selectedEnv: CountryEnvironmentModel,
  ) {}
}
