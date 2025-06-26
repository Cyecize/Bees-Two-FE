import { RequestTemplateArgType } from './request-template-arg.type';

/**
 * @monaco
 */
export interface RequestTemplateArg {
  id: number | null;
  type: RequestTemplateArgType;
  keyName: string;
  value: string | null;
  name: string;
}

/**
 * @monaco
 */
export interface RequestTemplateArgView extends RequestTemplateArg {
  id: number;
  templateId: number;
}
