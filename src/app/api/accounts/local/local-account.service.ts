import { Injectable } from '@angular/core';
import { LocalAccountRepository } from './local-account.repository';
import { LocalAccountQuery } from './local-account.query';
import { Page } from '../../../shared/util/page';
import { LocalAccount } from './local-account';
import { firstValueFrom } from 'rxjs';
import { CreateLocalAccountPayload } from './create-local-account.payload';

@Injectable({ providedIn: 'root' })
export class LocalAccountService {
  constructor(private repository: LocalAccountRepository) {}

  public async searchAccounts(
    query: LocalAccountQuery,
  ): Promise<Page<LocalAccount>> {
    return firstValueFrom(this.repository.search(query));
  }

  public async createAccount(
    payload: CreateLocalAccountPayload
  ): Promise<LocalAccount> {
    return firstValueFrom(this.repository.create(payload));
  }
}
