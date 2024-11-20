import { Injectable } from '@angular/core';
import { OrderRepository } from './order.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { OrderSearchResult } from './dto/order-search-result';
import { OrderQuery } from './dto/order.query';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';
import { RelayService } from '../relay/relay.service';
import { OrderStatus } from './order.status';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private relayService: RelayService,
  ) {}

  public async searchOrders(
    query: OrderQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<OrderSearchResult>> {
    return await new FieldErrorWrapper(() =>
      this.orderRepository.searchOrders(query, env?.id),
    ).execute();
  }

  public async changeStatus(
    orderNumber: string,
    status: OrderStatus,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<any>(
        BeesEntity.ORDERS,
        RequestMethod.PATCH,
        RelayVersion.V3,
        [],
        JSON.stringify([
          {
            order: {
              orderNumber: orderNumber,
              status: status,
            },
          },
        ]),
        env?.id,
      ),
    ).execute();
  }
}
