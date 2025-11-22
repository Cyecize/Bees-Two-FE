import { HttpClientSecuredService } from '../../../../shared/http/http-client-secured.service';
import { Injectable } from '@angular/core';
import { CreateRequestTemplatePreset } from './create-request-template-preset';
import { Observable } from 'rxjs';
import {
  RequestTemplatePreset,
  RequestTemplatePresetWithValues,
} from './request-template-preset';
import { Endpoints } from '../../../../shared/http/endpoints';
import { RouteUtils } from '../../../../shared/routing/route-utils';
import { Page } from '../../../../shared/util/page';
import { RequestTemplatePresetQuery } from './request-template-preset.query';

@Injectable({
  providedIn: 'root',
})
export class RequestTemplatePresetRepository {
  constructor(private http: HttpClientSecuredService) {}

  public create(
    payload: CreateRequestTemplatePreset,
  ): Observable<RequestTemplatePresetWithValues> {
    return this.http.post<
      CreateRequestTemplatePreset,
      RequestTemplatePresetWithValues
    >(Endpoints.REQUEST_TEMPLATE_PRESETS, payload);
  }

  public edit(
    presetId: number,
    payload: CreateRequestTemplatePreset,
  ): Observable<RequestTemplatePresetWithValues> {
    return this.http.put<
      CreateRequestTemplatePreset,
      RequestTemplatePresetWithValues
    >(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE_PRESET, [presetId]),
      payload,
    );
  }

  public getPreset(
    presetId: number,
  ): Observable<RequestTemplatePresetWithValues> {
    return this.http.get<RequestTemplatePresetWithValues>(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE_PRESET_VALUES, [
        presetId,
      ]),
    );
  }

  public deletePreset(presetId: number): Observable<any> {
    return this.http.delete(
      RouteUtils.setPathParams(Endpoints.REQUEST_TEMPLATE_PRESET, [presetId]),
    );
  }

  public search(
    query: RequestTemplatePresetQuery,
  ): Observable<Page<RequestTemplatePreset>> {
    return this.http.post<any, Page<RequestTemplatePreset>>(
      Endpoints.REQUEST_TEMPLATE_PRESETS_SEARCH,
      query,
    );
  }
}
