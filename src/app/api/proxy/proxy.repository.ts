import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { ProxyRequestPayload } from './proxy-request.payload';
import { BeesResponse } from './bees-response';

@Injectable({ providedIn: 'root' })
export class ProxyRepository {
  constructor(private http: HttpClientService) {}

  public makeRequest<TResponse>(
    payload: ProxyRequestPayload,
  ): Observable<BeesResponse<TResponse>> {
    return this.http.post<ProxyRequestPayload, BeesResponse<TResponse>>(
      Endpoints.REQUEST,
      payload,
    );
  }
}
