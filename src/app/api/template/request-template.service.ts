import { Injectable } from '@angular/core';
import { RequestTemplateRepository } from './request-template.repository';
import { RequestTemplate, RequestTemplateView } from './request-template';
import {
  FieldErrorWrapperLocal,
  WrappedResponseLocal,
} from '../../shared/util/field-error-wrapper-local';
import { RequestTemplateQuery } from './request-template.query';
import { Page } from '../../shared/util/page';

@Injectable({ providedIn: 'root' })
export class RequestTemplateService {
  constructor(private repository: RequestTemplateRepository) {}

  public async createTemplate(
    template: RequestTemplate,
  ): Promise<WrappedResponseLocal<RequestTemplateView>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.create(template),
    ).execute();
  }

  async searchTemplates(
    query: RequestTemplateQuery,
  ): Promise<WrappedResponseLocal<Page<RequestTemplateView>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.search(query),
    ).execute();
  }
}
