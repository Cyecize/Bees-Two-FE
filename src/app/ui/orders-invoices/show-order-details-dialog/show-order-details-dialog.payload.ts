import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Order } from '../../../api/orders/dto/order';

export class ShowOrderDetailsDialogPayload {
  constructor(
    public order: Order,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
