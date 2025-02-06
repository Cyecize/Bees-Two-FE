import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { RelayService } from '../relay/relay.service';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { RequestTemplateView } from './request-template';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';

@Injectable({ providedIn: 'root' })
export class RequestTemplateRunningService {
  constructor(
    private proxyService: ProxyService,
    private relayService: RelayService,
  ) {}

  /*
  TODO: refactor this as these request now are not aware that there may be multiple envs ran, so this is temporary
   */

  public async runOnce(
    env: CountryEnvironmentModel,
    template: RequestTemplateView,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    let response: Observable<BeesResponse<any>>;
    if (template.dataIngestionVersion) {
      response = this.relayService.send(
        template.entity,
        template.method,
        template.dataIngestionVersion,
        template.headers,
        template.payloadTemplate,
        env.id,
        template.id,
        template.saveInHistory,
      );
    } else {
      response = this.proxyService.makeRequest({
        templateId: template.id,
        data: template.payloadTemplate,
        headers: template.headers,
        method: template.method,
        entity: template.entity,
        saveInHistory: template.saveInHistory,
        targetEnv: env.id,
        endpoint: template.endpoint,
        queryParams: template.queryParams,
      });
    }

    return await new FieldErrorWrapper(() => response).execute();
  }
}
