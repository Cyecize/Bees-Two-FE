import { Injectable } from '@angular/core';
import { RequestTemplateRepository } from './request-template.repository';
import {
  RequestTemplate,
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
} from './request-template';
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
  ): Promise<WrappedResponseLocal<RequestTemplateFull>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.create(template),
    ).execute();
  }

  public async saveTemplate(
    templateId: number,
    template: RequestTemplate,
  ): Promise<WrappedResponseLocal<RequestTemplateFull>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.update(templateId, template),
    ).execute();
  }

  async searchTemplates(
    query: RequestTemplateQuery,
  ): Promise<WrappedResponseLocal<Page<RequestTemplateDtoForSearch>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.search(query),
    ).execute();
  }

  async deleteTemplate(id: number): Promise<WrappedResponseLocal<void>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.delete(id),
    ).execute();
  }

  async getTemplate(
    id: number,
    presetId?: number,
  ): Promise<WrappedResponseLocal<RequestTemplateFull>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.get(id, presetId),
    ).execute();
  }
}
