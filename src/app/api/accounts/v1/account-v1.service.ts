import { Injectable } from '@angular/core';
import { AccountV1Repository } from './account-v1.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { AccountV1SearchQuery } from './account-v1-search.query';
import { AccountV1 } from './account-v1';

@Injectable({ providedIn: 'root' })
export class AccountV1Service {
  constructor(private repository: AccountV1Repository) {}

  public async searchAccounts(
    query: AccountV1SearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<AccountV1[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchAccounts(query, env?.id),
    ).execute();
  }
}
