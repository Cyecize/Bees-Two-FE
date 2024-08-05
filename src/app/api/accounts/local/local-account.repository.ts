import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../shared/http/http-client.service';
import { Observable } from 'rxjs';
import { Endpoints } from '../../../shared/http/endpoints';
import { Page } from '../../../shared/util/page';
import { LocalAccount } from './local-account';
import { LocalAccountQuery } from './local-account.query';

@Injectable({ providedIn: 'root' })
export class LocalAccountRepository {
  constructor(private http: HttpClientService) {}

  public search(query: LocalAccountQuery): Observable<Page<LocalAccount>> {
    return this.http.post<LocalAccountQuery, Page<LocalAccount>>(
      Endpoints.ACCOUNTS_SEARCH,
      query,
    );
  }
}
