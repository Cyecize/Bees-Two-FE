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

  newSearchQuery(): ItemsSearchQuery;
}

@Injectable({ providedIn: 'root' })
export class ItemService implements IItemService {
  constructor(private repository: ItemRepository) {}

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

  newSearchQuery(): ItemsSearchQuery {
    return new ItemSearchQueryImpl();
  }
}
