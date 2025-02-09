import { Injectable } from '@angular/core';
import { LocalAccountRepository } from './local-account.repository';
import {
  LocalAccountQuery,
  LocalAccountQueryImpl,
} from './local-account.query';
import { Page } from '../../../shared/util/page';
import { LocalAccount } from './local-account';
import { firstValueFrom } from 'rxjs';
import { CreateLocalAccountPayload } from './create-local-account.payload';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { AccountV1 } from '../v1/account-v1';

@Injectable({ providedIn: 'root' })
export class LocalAccountService {
  constructor(private repository: LocalAccountRepository) {}

  public async searchAccounts(
    query: LocalAccountQuery,
  ): Promise<Page<LocalAccount>> {
    return firstValueFrom(this.repository.search(query));
  }

  public async createAccount(
    payload: CreateLocalAccountPayload,
  ): Promise<LocalAccount> {
    return firstValueFrom(this.repository.create(payload));
  }

  public async createFromBeesAccountIfNotExists(
    env: CountryEnvironmentModel,
    beesAccount: AccountV1,
  ): Promise<LocalAccount | null> {
    const query = new LocalAccountQueryImpl();
    query.beesId = beesAccount.accountId;
    query.env = env.id;

    const searchRes = await this.searchAccounts(query);
    if (searchRes.totalElements > 0) {
      return null;
    }

    const payload: CreateLocalAccountPayload = {
      beesId: beesAccount.accountId,
      customerAccountId: beesAccount.customerAccountId,
      name: beesAccount.name,
      vendorAccountId: beesAccount.vendorAccountId,
      envId: env.id,
    };

    return await this.createAccount(payload);
  }
}
