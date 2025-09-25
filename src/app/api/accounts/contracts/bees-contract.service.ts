import { Injectable } from '@angular/core';
import { BeesContractRepository } from './bees-contract.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { PageWithPagination } from '../../../shared/util/page';
import { BeesContract } from './bees-contract';
import {
  BeesContractQuery,
  BeesContractQueryImpl,
} from './bees-contract.query';
import { Order } from '../../orders/dto/order';
import { ConcurrentPaginationService } from '../../../shared/util/concurrent-pagination.service';

/**
 * @monaco
 */
export interface ContractFetchResponse {
  hasError: boolean;
  contracts: BeesContract[];
  totalPages: number;
}

/**
 * @monaco
 */
export interface IBeesContractService {
  findTopByDdc(
    maxResults: number,
    ddc: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>>;

  searchContracts(
    query: BeesContractQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>>;

  fetchAll(
    query: BeesContractQuery,
    env?: CountryEnvironmentModel,
    maxConcurrentCalls?: number,
  ): Promise<ContractFetchResponse>;

  newQuery(): BeesContractQuery;
}

@Injectable({ providedIn: 'root' })
export class BeesContractService implements IBeesContractService {
  constructor(
    private repository: BeesContractRepository,
    private concurrentPaginationService: ConcurrentPaginationService,
  ) {}

  public async findTopByDdc(
    maxResults: number,
    ddc: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>> {
    const query: BeesContractQuery = new BeesContractQueryImpl();
    query.deliveryCenterId.push(ddc);
    query.vendorId.push(env.vendorId);
    query.page.pageSize = maxResults;

    return await new FieldErrorWrapper(() =>
      this.repository.searchContracts(query, env.id),
    ).execute();
  }

  async searchContracts(
    query: BeesContractQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchContracts(query, env?.id),
    ).execute();
  }

  async fetchAll(
    query: BeesContractQuery,
    env?: CountryEnvironmentModel,
    maxConcurrentCalls = 5,
  ): Promise<ContractFetchResponse> {
    const oldSize = query.page.pageSize;

    try {
      const response =
        await this.concurrentPaginationService.fetchAll<BeesContract>(
          async (page, pageSize) => {
            query.page.page = page;
            query.page.pageSize = pageSize;

            const resp = await this.searchContracts(query, env);

            if (!resp.isSuccess) {
              return {
                items: [],
                hasNext: false,
                hasError: true,
              };
            }

            const pagination = resp.response.response.pagination;

            return {
              items: resp.response.response.content,
              hasNext: pagination.totalPages - 1 > pagination.page,
            };
          },
          {
            pageSize: 500, // 500 is the max, more than 500 is ignored
            maxConcurrent: maxConcurrentCalls,
          },
        );

      return {
        contracts: response.items,
        hasError: response.hasError,
        totalPages: response.pages,
      };
    } finally {
      query.page.pageSize = oldSize;
    }
  }

  newQuery(): BeesContractQuery {
    return new BeesContractQueryImpl();
  }
}
