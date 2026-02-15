import { TemplateArgDataType } from './template-arg-data.type';
import { TemplateArgPromptType } from './template-arg-prompt.type';
import { TemplateArgInputType } from './template-arg-input.type';

/**
 * @monaco
 */
export interface RequestTemplateArg {
  id: number | null;
  dataType: TemplateArgDataType;
  arrayType: boolean;
  customType: string | null;
  required: boolean;
  promptType: TemplateArgPromptType;
  inputType: TemplateArgInputType;
  keyName: string;
  value: string | null;
  name: string;
  description: string | null;
  orderNumber: number;
}

/**
 * @monaco
 */
export interface RequestTemplateArgView extends RequestTemplateArg {
  id: number;
  templateId: number;
}

/**
 * @monaco
 */
export interface TypedRequestTemplateArg<T> {
  id: number | null;
  dataType: TemplateArgDataType;
  arrayType: boolean;
  customType: string | null;
  required: boolean;
  promptType: TemplateArgPromptType;
  inputType: TemplateArgInputType;
  keyName: string;
  value: T | null;
  name: string;
  description: string | null;
  orderNumber: number;
}
