import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/util/page';
import { Endpoints } from '../../shared/http/endpoints';
import { RouteUtils } from '../../shared/routing/route-utils';
import { RequestTemplateQuery } from './request-template.query';
import { RequestTemplate, RequestTemplateView } from './request-template';

@Injectable({ providedIn: 'root' })
export class RequestTemplateRepository {
  constructor(private http: HttpClientSecuredService) {}

  public search(
    query: RequestTemplateQuery,
  ): Observable<Page<RequestTemplateView>> {
    return this.http.post<RequestTemplateQuery, Page<RequestTemplateView>>(
      Endpoints.REQUEST_TEMPLATES_SEARCH,
      query,
    );
  }

  public create(payload: RequestTemplate): Observable<RequestTemplateView> {
    return this.http.post<RequestTemplate, RequestTemplateView>(
      Endpoints.REQUEST_TEMPLATES,
      payload,
    );
  }

  public update(
    templateId: number,
    payload: RequestTemplate,
  ): Observable<RequestTemplateView> {
    return this.http.put<RequestTemplate, RequestTemplateView>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
      payload,
    );
  }

  public get(templateId: number): Observable<RequestTemplateView> {
    return this.http.get<RequestTemplateView>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
    );
  }

  public delete(templateId: number): Observable<void> {
    return this.http.delete<void>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE, [templateId]),
    );
  }
}
