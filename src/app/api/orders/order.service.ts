import { Injectable } from '@angular/core';
import { OrderRepository } from './order.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { OrderSearchResult } from './dto/order-search-result';
import { OrderQuery } from './dto/order.query';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async searchOrders(
    query: OrderQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<OrderSearchResult>> {
    return await new FieldErrorWrapper(() =>
      this.orderRepository.searchOrders(query, env?.id),
    ).execute();
  }
}
