import { RequestTemplatePresetArgval } from './value/request-template-preset-argval';

/**
 * @monaco
 */
export interface RequestTemplatePreset {
  id: number;
  templateId: number;
  name: string;
  createDate: string;
  updateDate: string;
}

/**
 * @monaco
 */
export interface RequestTemplatePresetWithValues {
  id: number;
  templateId: number;
  name: string;
  argValues: RequestTemplatePresetArgval[];
  createDate: string;
  updateDate: string;
}
