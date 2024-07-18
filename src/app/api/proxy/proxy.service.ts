import { Injectable } from '@angular/core';
import { ProxyRequestPayload } from './proxy-request.payload';
import { Observable } from 'rxjs';
import { ProxyRepository } from './proxy.repository';
import { CountryEnvironmentService } from '../env/country-environment.service';
import { RequestMethod } from './request-method';
import { BeesResponse } from './bees-response';

@Injectable({ providedIn: 'root' })
export class ProxyService {
  constructor(
    private repository: ProxyRepository,
    private countryEnvService: CountryEnvironmentService,
  ) {}

  public makeRequest<TResponse>(
    payload: ProxyRequestPayload,
  ): Observable<BeesResponse<TResponse>> {
    if (!payload.targetEnv) {
      const currentEnv = this.countryEnvService.getCurrentEnv();
      if (!currentEnv) {
        throw new Error('Please select an environment');
      }

      payload.targetEnv = currentEnv.id;
    }

    if (!payload.method) {
      payload.method = RequestMethod.GET;
    }

    return this.repository.makeRequest(payload);
  }
}
