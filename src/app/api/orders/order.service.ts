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
import { ConcurrentPaginationService } from '../../shared/util/concurrent-pagination.service';

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
    maxConcurrent?: number,
  ): Promise<Order[]>;
  createQuery(): OrderQuery;
}

@Injectable({ providedIn: 'root' })
export class OrderService implements IOrderService {
  constructor(
    private orderRepository: OrderRepository,
    private relayService: RelayService,
    private concurrentPaginationService: ConcurrentPaginationService,
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
    maxConcurrent = 10,
  ): Promise<Order[]> {
    const oldSize = query.page.pageSize;

    try {
      const response = await this.concurrentPaginationService.fetchAll<Order>(
        async (page, pageSize) => {
          query.page.page = page;
          query.page.pageSize = pageSize;

          const resp = await this.searchOrders(query, env);

          if (!resp.isSuccess) {
            return {
              items: [],
              hasNext: false,
              hasError: true,
            };
          }

          return {
            items: resp.response.response.orders,
            hasNext: resp.response.response.pagination.hasNext,
          };
        },
        {
          pageSize: 100, // 100 is the max, more than 100 is ignored
          maxConcurrent: maxConcurrent,
        },
      );

      if (response.hasError) {
        throw new Error(
          'Could not load all orders since some of the requests failed!',
        );
      } else {
        return response.items;
      }
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
