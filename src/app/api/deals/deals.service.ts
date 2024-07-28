import { Injectable } from '@angular/core';
import { DealsRepository } from './deals.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesResponse } from '../proxy/bees-response';
import { firstValueFrom } from 'rxjs';
import { DealsSearchQuery } from './deals-search.query';
import { DealsSearchResponse } from './deals-search.response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';

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
}
