import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Item } from '../../../api/items/item';

export class ShowItemDetailsDialogPayload {
  constructor(
    public item: Item,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
