import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { InclusionPayload } from '../../../api/product-assortment/inclusion.payload';

export interface AssortmentInclusionFormResult {
  env?: CountryEnvironmentModel;
  payload: InclusionPayload;
}
