
export enum RequestTemplatePrivacyType {
  SECRET = 'SECRET',
  READONLY = 'READONLY',
  LOCKED = 'LOCKED',
  PUBLIC = 'PUBLIC',
}

export interface RequestTemplatePrivacy {
  level: number;
  description: string;
  type: RequestTemplatePrivacyType;
}
