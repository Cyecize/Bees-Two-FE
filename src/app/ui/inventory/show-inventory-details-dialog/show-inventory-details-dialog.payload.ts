import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { FlattenedInventory } from '../../../api/inventory/dto/flattened-inventory';

export class ShowInventoryDetailsDialogPayload {
  constructor(
    public inventory: FlattenedInventory,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
