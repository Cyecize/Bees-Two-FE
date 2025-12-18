import { CreateRequestTemplatePresetArgval } from './value/create-request-template-preset-argval';

export interface CreateRequestTemplatePreset {
  templateId: number;
  name: string;
  argValues: CreateRequestTemplatePresetArgval[];
}
