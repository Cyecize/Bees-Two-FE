import { Order } from '../../../api/orders/dto/order';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';

export class ChangeOrderStatusDialogPayload {
  order: Order;
  env: CountryEnvironmentModel;

  constructor(order: Order, env: CountryEnvironmentModel) {
    this.order = order;
    this.env = env;
  }
}
