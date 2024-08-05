import { Injectable } from '@angular/core';
import { DealsRepository } from './deals.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { DealsSearchQuery } from './payloads/deals-search.query';
import { DealsSearchResponse } from './deals-search.response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { DeleteDealsPayload } from './payloads/delete-deals.payload';

@Injectable({ providedIn: 'root' })
export class DealsService {
  constructor(private repository: DealsRepository) {}

  public async searchDeals(
    query: DealsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<DealsSearchResponse>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchDeals(query, env?.id),
    ).execute();
  }

  public async deleteDeals(
    payload: DeleteDealsPayload,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.deleteDeals(payload, env),
    ).execute();
  }
}
