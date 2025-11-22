import { Injectable } from '@angular/core';
import { RequestTemplatePresetRepository } from './request-template-preset.repository';
import {
  FieldErrorWrapperLocal,
  WrappedResponseLocal,
} from '../../../../shared/util/field-error-wrapper-local';
import { Page } from '../../../../shared/util/page';
import { RequestTemplatePresetQuery } from './request-template-preset.query';
import {
  RequestTemplatePreset,
  RequestTemplatePresetWithValues,
} from './request-template-preset';
import { CreateRequestTemplatePreset } from './create-request-template-preset';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestTemplatePresetService {
  constructor(private repository: RequestTemplatePresetRepository) {}

  async searchPresets(
    query: RequestTemplatePresetQuery,
  ): Promise<WrappedResponseLocal<Page<RequestTemplatePreset>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.search(query),
    ).execute();
  }

  async createTemplate(
    payload: CreateRequestTemplatePreset,
  ): Promise<WrappedResponseLocal<RequestTemplatePresetWithValues>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.create(payload),
    ).execute();
  }

  async editTemplate(
    presetId: number,
    payload: CreateRequestTemplatePreset,
  ): Promise<WrappedResponseLocal<RequestTemplatePresetWithValues>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.edit(presetId, payload),
    ).execute();
  }

  async deletePreset(
    presetId: number,
  ): Promise<WrappedResponseLocal<RequestTemplatePresetWithValues>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.deletePreset(presetId),
    ).execute();
  }

  async getPreset(presetId: number): Promise<RequestTemplatePresetWithValues> {
    return firstValueFrom(this.repository.getPreset(presetId));
  }
}
