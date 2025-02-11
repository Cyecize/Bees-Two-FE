import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { Endpoints } from '../../shared/http/endpoints';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { CountryEnvironmentQuery } from './country-environment.query';
import { Page } from '../../shared/util/page';
import { CountryCodeQuery } from './country-code.query';
import { CountryEnvironmentPayload } from './country-environment.payload';
import { EnvToken } from './env-token';
import { RouteUtils } from '../../shared/routing/route-utils';
import { CountryEnvironmentCredsPayload } from './country-environment-creds.payload';

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

  public createEnv(
    payload: CountryEnvironmentPayload,
  ): Observable<CountryEnvironmentModel> {
    return this.http.post<CountryEnvironmentPayload, CountryEnvironmentModel>(
      Endpoints.ENVIRONMENTS,
      payload,
    );
  }

  public updateCreds(payload: CountryEnvironmentCredsPayload): Observable<any> {
    return this.http.put<CountryEnvironmentCredsPayload, any>(
      Endpoints.ENVIRONMENT_CREDS,
      payload,
    );
  }

  public getToken(envId: number): Observable<EnvToken> {
    return this.http.get<EnvToken>(
      RouteUtils.setPathParams(Endpoints.ENVIRONMENT_TOKEN, [envId]),
    );
  }
}
