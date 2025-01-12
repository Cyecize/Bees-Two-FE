import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CategoryV3 } from '../../../api/categories/category-v3';

export class ShowCategoryDetailsDialogPayload {
  constructor(
    public category: CategoryV3,
    public selectedEnv?: CountryEnvironmentModel,
  ) {}
}
