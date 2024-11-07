import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { ProxyRequestPayload } from './proxy-request.payload';
import { BeesResponse } from './bees-response';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { BeesResponsePerLanguage } from './bees-response-per-language';

@Injectable({ providedIn: 'root' })
export class ProxyRepository {
  constructor(private http: HttpClientSecuredService) {}

  public makeRequest<TResponse>(
    payload: ProxyRequestPayload,
  ): Observable<BeesResponse<TResponse>> {
    return this.http.post<ProxyRequestPayload, BeesResponse<TResponse>>(
      Endpoints.REQUEST,
      payload,
    );
  }

  public makeMultilanguageRequest<TResponse>(
    payload: ProxyRequestPayload,
  ): Observable<BeesResponsePerLanguage<TResponse>> {
    return this.http.post<
      ProxyRequestPayload,
      BeesResponsePerLanguage<TResponse>
    >(Endpoints.REQUEST_MULTILANGUAGE, payload);
  }
}
