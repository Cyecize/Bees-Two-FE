import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ItemsPriceFetchDataCollectionDialogPayload {
  constructor(public readonly env: CountryEnvironmentModel) {}
}
