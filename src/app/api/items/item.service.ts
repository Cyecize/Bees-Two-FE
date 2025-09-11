import { Injectable } from '@angular/core';
import { ItemRepository } from './item.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { ItemSearchQueryImpl, ItemsSearchQuery } from './items-search.query';
import { ItemsSearchResponse } from './items-search.response';
import { ItemPayload } from './item.payload';
import { Item } from './item';
import { ConcurrentPaginationService } from '../../shared/util/concurrent-pagination.service';

/**
 * @monaco
 */
export interface ItemFetchResponse {
  hasError: boolean;
  items: Item[];
  totalPages: number;
}

/**
 * @monaco
 */
export interface IItemService {
  searchItems(
    query: ItemsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<ItemsSearchResponse>>;

  saveItems(
    items: ItemPayload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  fetchAllItems(
    query: ItemsSearchQuery,
    env?: CountryEnvironmentModel,
    abortOnFail?: boolean,
    maxConcurrent?: number,
  ): Promise<ItemFetchResponse>;

  newSearchQuery(): ItemsSearchQuery;
}

@Injectable({ providedIn: 'root' })
export class ItemService implements IItemService {
  constructor(
    private repository: ItemRepository,
    private concurrentPaginationService: ConcurrentPaginationService,
  ) {}

  public async searchItems(
    query: ItemsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<ItemsSearchResponse>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchItems(query, env?.id),
    ).execute();
  }

  public async addItem(
    item: ItemPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.upsertItems([item], env?.id),
    ).execute();
  }

  public async saveItems(
    items: ItemPayload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.upsertItems(items, env?.id),
    ).execute();
  }

  public async fetchAllItems(
    query: ItemsSearchQuery,
    env?: CountryEnvironmentModel,
    abortOnFail = true,
    maxConcurrent?: number,
  ): Promise<ItemFetchResponse> {
    const resp = await this.concurrentPaginationService.fetchAll<Item>(
      async (page, pageSize) => {
        query.page.pageSize = pageSize;
        query.page.page = page;

        const response = await this.searchItems(query, env);
        if (response.isSuccess) {
          return {
            items: response.response.response.items,
            hasNext: response.response.response.pagination.hasNext,
          };
        } else {
          if (response.errorResp?.data?.statusCode === 404) {
            return {
              items: [],
              hasNext: false,
            };
          } else {
            console.log(
              `Error while fetching page ${page} for items.`,
              response,
            );
            return {
              items: [],
              hasNext: false,
              hasError: true,
            };
          }
        }
      },
      {
        pageSize: 200,
        abortOnFail: abortOnFail,
        maxConcurrent: maxConcurrent,
      },
    );

    return {
      items: resp.items,
      hasError: resp.hasError,
      totalPages: resp.pages,
    };
  }

  newSearchQuery(): ItemsSearchQuery {
    return new ItemSearchQueryImpl();
  }
}
