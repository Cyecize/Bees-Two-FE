import { Injectable } from '@angular/core';
import { CategoryRepository } from './category.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { CategoryV3Query, CategoryV3QueryImpl } from './category-v3.query';
import { CategoryV3 } from './category-v3';
import { CategoryV3Payload } from './category-v3.payload';
import { CreatedCategory } from './models/created-category';
import { ItemSortOrderPair } from './item-assign/dto/category-item-group';
import { CategoryItem } from './models/category-item';
import { CategoryWithParent } from './category-with-parent';

/**
 * @monaco
 */
export interface ICategoryV3Service {
  searchCategoriesV3(
    query: CategoryV3Query,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CategoryV3[]>>;

  getFlatCategories(
    env: CountryEnvironmentModel,
  ): Promise<CategoryWithParent[]>;

  patchV3(
    categoryId: string,
    val: any,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  assignItems(
    id: string,
    items: ItemSortOrderPair[],
    vendorId: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CategoryV3[]>>;

  postV3(
    storeId: string,
    payload: CategoryV3Payload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CreatedCategory[]>>;

  deleteV3(
    categoryIds: string[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  newQuery(): CategoryV3Query;
}

@Injectable({ providedIn: 'root' })
export class CategoryV3Service implements ICategoryV3Service {
  constructor(private repository: CategoryRepository) {}

  public async searchCategoriesV3(
    query: CategoryV3Query,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CategoryV3[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchCategoriesV3(query, env?.id),
    ).execute();
  }

  public async getFlatCategories(
    env: CountryEnvironmentModel,
  ): Promise<CategoryWithParent[]> {
    const query = new CategoryV3QueryImpl();
    query.storeId = env.storeId;

    const resp = await this.searchCategoriesV3(query, env);

    if (!resp.isSuccess) {
      console.log(resp);
      throw new Error('Error while fetching flat categories!');
    }

    const flatCats: CategoryWithParent[] = [];

    const loopCategories = (
      cats: CategoryV3[],
      parent?: CategoryWithParent,
    ): void => {
      for (const cat of cats) {
        const catWithParent: CategoryWithParent = {
          ...cat,
          parent: parent ? parent : null,
        };
        flatCats.push(catWithParent);

        if (cat.categories?.length) {
          loopCategories(cat.categories, catWithParent);
        }
      }
    };

    loopCategories(resp.response.response);

    return flatCats;
  }

  public async patchV3(
    categoryId: string,
    val: any,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.patchCategoryV3(categoryId, val, env?.id),
    ).execute();
  }

  async assignItems(
    id: string,
    items: ItemSortOrderPair[],
    vendorId: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CategoryV3[]>> {
    const addedItems: CategoryItem[] = items.map((it) => {
      return {
        vendorItemId: it.vendorItemId,
        vendorId: vendorId,
        sortOrder: it.sortOrder,
      };
    });

    return this.patchV3(id, { addedItems: addedItems }, env);
  }

  public async postV3(
    storeId: string,
    payload: CategoryV3Payload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CreatedCategory[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.postCategoryV3(storeId, payload, env?.id),
    ).execute();
  }

  public async deleteV3(
    categoryIds: string[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.deleteCategoryV3(categoryIds, env?.id),
    ).execute();
  }

  public newQuery(): CategoryV3Query {
    return new CategoryV3QueryImpl();
  }
}
