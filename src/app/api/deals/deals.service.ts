import { Injectable } from '@angular/core';
import { DealsRepository } from './deals.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  DealsSearchQuery,
  DealsSearchQueryImpl,
} from './payloads/deals-search.query';
import { DealsSearchResponse } from './deals-search.response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { DeleteDealsPayload } from './payloads/delete-deals.payload';
import {
  CreateDealsPayload,
  DealPayload,
} from './payloads/create-deals.payload';

/**
 * @monaco
 */
export interface IDealsService {
  searchDeals(
    query: DealsSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<DealsSearchResponse>>;

  deleteDeals(
    payload: DeleteDealsPayload,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  createDeals(
    payload: CreateDealsPayload,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  newQuery(): DealsSearchQuery;
}

@Injectable({ providedIn: 'root' })
export class DealsService implements IDealsService {
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

  public async createDeals(
    payload: CreateDealsPayload,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.repository.upsert(payload, env),
    ).execute();
  }

  newQuery(): DealsSearchQuery {
    return new DealsSearchQueryImpl();
  }
}
