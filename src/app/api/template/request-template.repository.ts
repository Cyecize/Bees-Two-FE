import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/util/page';
import { Endpoints } from '../../shared/http/endpoints';
import { RouteUtils } from '../../shared/routing/route-utils';
import { RequestTemplateQuery } from './request-template.query';
import {
  RequestTemplate,
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
} from './request-template';

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

  public create(payload: RequestTemplate): Observable<RequestTemplateFull> {
    return this.http.post<RequestTemplate, RequestTemplateFull>(
      Endpoints.REQUEST_TEMPLATES,
      payload,
    );
  }

  public update(
    templateId: number,
    payload: RequestTemplate,
  ): Observable<RequestTemplateFull> {
    return this.http.put<RequestTemplate, RequestTemplateFull>(
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
