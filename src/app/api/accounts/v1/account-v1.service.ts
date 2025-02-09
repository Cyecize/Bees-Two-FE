import { Injectable } from '@angular/core';
import { AccountV1Repository } from './account-v1.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import {
  AccountV1SearchQuery,
  AccountV1SearchQueryImpl,
} from './account-v1-search.query';
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

  public async findOne(
    env: CountryEnvironmentModel,
    vendorAccountId?: string,
    customerAccountId?: string,
  ): Promise<AccountV1 | null> {
    const query: AccountV1SearchQuery = new AccountV1SearchQueryImpl();
    query.vendorId = env.vendorId;
    query.vendorAccountId = vendorAccountId;
    query.customerAccountId = customerAccountId;

    const resp = await this.searchAccounts(query, env);
    if (!resp.isSuccess) {
      console.error(resp);
      return null;
    }

    if (resp.response.response.length <= 0) {
      return null;
    }

    return resp.response.response[0];
  }
}
