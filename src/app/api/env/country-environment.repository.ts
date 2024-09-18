import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { Endpoints } from '../../shared/http/endpoints';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { CountryEnvironmentQuery } from './country-environment.query';
import { Page } from '../../shared/util/page';
import { CountryCodeQuery } from './country-code.query';

@Injectable({ providedIn: 'root' })
export class CountryEnvironmentRepository {
  constructor(private http: HttpClientSecuredService) {}

  public getAllEnvs(): Observable<CountryEnvironmentModel[]> {
    return this.http.get<CountryEnvironmentModel[]>(Endpoints.ENVIRONMENTS);
  }

  public searchEnvs(
    query: CountryEnvironmentQuery,
  ): Observable<Page<CountryEnvironmentModel>> {
    return this.http.post<
      CountryEnvironmentQuery,
      Page<CountryEnvironmentModel>
    >(Endpoints.ENVIRONMENTS_SEARCH, query);
  }

  public searchCountryCodes(query: CountryCodeQuery): Observable<Page<string>> {
    return this.http.post<CountryCodeQuery, Page<string>>(
      Endpoints.ENVIRONMENTS_COUNTRY_CODES,
      query,
    );
  }
}
