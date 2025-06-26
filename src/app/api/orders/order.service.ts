import { Injectable } from '@angular/core';
import { OrderRepository } from './order.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { OrderSearchResult } from './dto/order-search-result';
import { OrderQuery, OrderQueryImpl } from './dto/order.query';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';
import { RelayService } from '../relay/relay.service';
import { OrderStatus } from './order.status';
import { Order } from './dto/order';

/**
 * @monaco
 */
export interface IOrderService {
  searchOrders(
    query: OrderQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<OrderSearchResult>>;
  fetchAllPages(
    query: OrderQuery,
    env?: CountryEnvironmentModel,
  ): Promise<Order[]>;
  createQuery(): OrderQuery;
}

@Injectable({ providedIn: 'root' })
export class OrderService implements IOrderService {
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

  public async fetchAllPages(
    query: OrderQuery,
    env?: CountryEnvironmentModel,
  ): Promise<Order[]> {
    const oldSize = query.page.pageSize;

    try {
      query.page.pageSize = 100; // 100 is the max, more than 100 is ignored
      const res: Order[] = [];
      let page = -1;
      let hasNext = true;

      while (hasNext) {
        page++;
        query.page.page = page;
        console.log(`fetching page ${page}`);

        const resp = await this.searchOrders(query, env);
        if (!resp.isSuccess) {
          throw new Error(
            'Could not load all pages, stopping on page ' + (page + 1),
          );
        }

        res.push(...resp.response.response.orders);
        hasNext = resp.response?.response?.pagination.hasNext || false;
      }

      return res;
    } finally {
      query.page.pageSize = oldSize;
    }
  }

  public createQuery(): OrderQuery {
    return new OrderQueryImpl();
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
