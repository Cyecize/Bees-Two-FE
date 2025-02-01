import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';

export interface RequestTemplate {
  name: string;
  entity: BeesEntity;
  dataIngestionVersion?: string;
  endpoint: string;
  method: RequestMethod;
  queryParams: BeesParam[];
  headers: BeesParam[];
  payloadTemplate?: string;
  saveInHistory: boolean;
}

export interface RequestTemplateView extends RequestTemplate {
  id: number;
  userId: number;
}
