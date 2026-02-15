import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/util/page';
import { Endpoints } from '../../shared/http/endpoints';
import { RouteUtils } from '../../shared/routing/route-utils';
import { RequestTemplateQuery } from './request-template.query';
import {
  RequestTemplateBase,
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
  RequestTemplateRequest,
} from './request-template';
import { RequestTemplatePrivacy } from './request-template-privacy';

@Injectable({ providedIn: 'root' })
export class RequestTemplateRepository {
  constructor(private http: HttpClientSecuredService) {}

  public search(
    query: RequestTemplateQuery,
  ): Observable<Page<RequestTemplateDtoForSearch>> {
    return this.http.post<
      RequestTemplateQuery,
      Page<RequestTemplateDtoForSearch>
    >(Endpoints.REQUEST_TEMPLATES_SEARCH, query);
  }

  public getPrivacyOptions(): Observable<RequestTemplatePrivacy[]> {
    return this.http.get<RequestTemplatePrivacy[]>(
      Endpoints.REQUEST_TEMPLATES_PRIVACY_OPTIONS,
    );
  }

  public create(
    payload: RequestTemplateRequest,
  ): Observable<RequestTemplateFull> {
    return this.http.post<RequestTemplateRequest, RequestTemplateFull>(
      Endpoints.REQUEST_TEMPLATES,
      payload,
    );
  }

  public update(
    templateId: number,
    payload: RequestTemplateBase,
  ): Observable<RequestTemplateFull> {
    return this.http.put<RequestTemplateBase, RequestTemplateFull>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
      payload,
    );
  }

  public get(
    templateId: number,
    presetId?: number,
  ): Observable<RequestTemplateFull> {
    const params: any = {};
    if (presetId) {
      params['presetId'] = presetId;
    }

    return this.http.get<RequestTemplateFull>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
      { params },
    );
  }

  public delete(templateId: number): Observable<void> {
    return this.http.delete<void>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
    );
  }
}
