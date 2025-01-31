import { Injectable } from '@angular/core';
import { ProxyRequestPayload } from './proxy-request.payload';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProxyRepository } from './proxy.repository';
import { CountryEnvironmentService } from '../env/country-environment.service';
import { RequestMethod } from '../common/request-method';
import { BeesResponse } from './bees-response';
import { BeesMultilanguageTransformer } from './bees-multilanguage-transformer';
import { map } from 'rxjs/operators';
import { BeesResponsePerLanguage } from './bees-response-per-language';

@Injectable({ providedIn: 'root' })
export class ProxyService {
  private readonly saveNextRequest: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public readonly saveNextRequest$ = this.saveNextRequest.asObservable();

  constructor(
    private repository: ProxyRepository,
    private countryEnvService: CountryEnvironmentService,
  ) {}

  public makeRequest<TResponse>(
    payload: ProxyRequestPayload,
  ): Observable<BeesResponse<TResponse>> {
    this.configureSaveRequest(payload);
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

  public makeMultilanguageRequest<TResponse>(
    payload: ProxyRequestPayload,
    transformer: BeesMultilanguageTransformer<TResponse>,
  ): Observable<BeesResponse<TResponse>> {
    this.configureSaveRequest(payload);
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

    return this.repository.makeMultilanguageRequest(payload).pipe(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map((responses: BeesResponsePerLanguage<TResponse>[]) => {
        return transformer.transform(responses);
      }),
    );
  }

  public setSaveNextRequest(val: boolean): void {
    this.saveNextRequest.next(val);
  }

  private configureSaveRequest(payload: ProxyRequestPayload): void {
    const save = this.saveNextRequest.value;
    if (save) {
      payload.saveInHistory = true;
      this.setSaveNextRequest(false);
    }
  }
}
