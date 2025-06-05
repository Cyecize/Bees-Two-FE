import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/util/page';
import { Endpoints } from '../../../shared/http/endpoints';
import { SharedClientQuery } from './shared-client.query';
import { SharedClient } from './shared-client';
import { SharedClientPayload } from './shared-client.payload';
import { RouteUtils } from '../../../shared/routing/route-utils';
import { CountryEnvironmentModel } from '../country-environment.model';
import { SharedClientToken } from './shared-client-token';

@Injectable({ providedIn: 'root' })
export class SharedClientRepository {
  constructor(private readonly http: HttpClientSecuredService) {}

  public searchSharedClients(
    query: SharedClientQuery,
  ): Observable<Page<SharedClient>> {
    return this.http.post<SharedClientQuery, Page<SharedClient>>(
      Endpoints.SHARED_CLIENTS_SEARCH,
      query,
    );
  }

  public createSharedClient(
    payload: SharedClientPayload,
  ): Observable<SharedClient> {
    return this.http.post<SharedClientPayload, SharedClient>(
      Endpoints.SHARED_CLIENTS,
      payload,
    );
  }

  public deleteSharedClient(clientId: number): Observable<any> {
    return this.http.delete<null>(
      RouteUtils.setPathParams(Endpoints.SHARED_CLIENT, [clientId]),
    );
  }

  public assignEnvironment(clientId: number, envId: number): Observable<any> {
    return this.http.patch(
      RouteUtils.setPathParams(Endpoints.SHARED_CLIENT_ENVIRONMENT, {
        id: clientId,
        envId: envId,
      }),
      null,
    );
  }

  public unAssignEnvironment(clientId: number, envId: number): Observable<any> {
    return this.http.delete(
      RouteUtils.setPathParams(Endpoints.SHARED_CLIENT_ENVIRONMENT, {
        id: clientId,
        envId: envId,
      }),
    );
  }

  public getEnvsForClient(
    clientId: number,
  ): Observable<CountryEnvironmentModel[]> {
    return this.http.get<CountryEnvironmentModel[]>(
      RouteUtils.setPathParams(Endpoints.SHARED_CLIENT_ENVIRONMENTS, [
        clientId,
      ]),
    );
  }

  public getAssignedClientsForEnv(envId: number): Observable<SharedClient[]> {
    return this.http.get<SharedClient[]>(
      RouteUtils.setPathParams(Endpoints.ENVIRONMENT_SHARED_CLIENTS, [envId]),
    );
  }

  public getToken(clientId: number): Observable<SharedClientToken> {
    return this.http.get<SharedClientToken>(
      RouteUtils.setPathParams(Endpoints.SHARED_CLIENT_TOKEN, [clientId]),
    );
  }
}
