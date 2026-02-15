import { Injectable } from '@angular/core';
import { RequestTemplateRepository } from './request-template.repository';
import {
  RequestTemplateBase,
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
  RequestTemplateRequest,
} from './request-template';
import {
  FieldErrorWrapperLocal,
  WrappedResponseLocal,
} from '../../shared/util/field-error-wrapper-local';
import { RequestTemplateQuery } from './request-template.query';
import { Page } from '../../shared/util/page';
import { BehaviorSubject, filter } from 'rxjs';
import { RequestTemplatePrivacy } from './request-template-privacy';
import { ObjectUtils } from '../../shared/util/object-utils';

@Injectable({ providedIn: 'root' })
export class RequestTemplateService {
  private readonly privacyOptions: BehaviorSubject<
    RequestTemplatePrivacy[] | undefined
  > = new BehaviorSubject<RequestTemplatePrivacy[] | undefined>(undefined);

  public readonly privacyOptions$ = this.privacyOptions
    .asObservable()
    .pipe(filter((val) => !ObjectUtils.isNil(val)));

  constructor(private repository: RequestTemplateRepository) {
    this.repository
      .getPrivacyOptions()
      .subscribe((val) => this.privacyOptions.next(val));
  }

  public async createTemplate(
    template: RequestTemplateRequest,
  ): Promise<WrappedResponseLocal<RequestTemplateFull>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.create(template),
    ).execute();
  }

  public async saveTemplate(
    templateId: number,
    template: RequestTemplateBase,
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
