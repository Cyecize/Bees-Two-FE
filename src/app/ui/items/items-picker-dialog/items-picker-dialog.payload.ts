import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ItemsPickerDialogPayload {
  constructor(
    public readonly env: CountryEnvironmentModel,
    public readonly vendorItemId?: string,
  ) {}
}

/**
 * @monaco
 */
export interface IItemsPickerDialogPayload {
  env: CountryEnvironmentModel;
  vendorItemId?: string;
}
