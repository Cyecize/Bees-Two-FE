import { RequestTemplateArgType } from './request-template-arg.type';

export interface RequestTemplateArg {
  id: number | null;
  type: RequestTemplateArgType;
  keyName: string;
  value: string | null;
  name: string;
}

export interface RequestTemplateArgView {
  id: number;
  templateId: number;
}
