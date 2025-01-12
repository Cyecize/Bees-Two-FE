import { Injectable } from '@angular/core';
import { CategoryRepository } from './category.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { CategoryV3Query } from './category-v3.query';
import { CategoryV3 } from './category-v3';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  public async searchCategoriesV3(
    query: CategoryV3Query,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CategoryV3[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchCategoriesV3(query, env?.id),
    ).execute();
  }
}
