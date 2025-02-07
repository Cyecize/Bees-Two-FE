import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';
import { RelayVersion } from '../relay/relay.version';
import {
  RequestTemplateArg,
  RequestTemplateArgView,
} from './arg/request-template-arg';
import { RequestTemplatePayloadType } from './request-template-payload.type';

export interface RequestTemplate {
  name: string;
  entity: BeesEntity;
  dataIngestionVersion: RelayVersion | null;
  endpoint: string;
  method: RequestMethod;
  queryParams: BeesParam[];
  headers: BeesParam[];
  payloadTemplate: string | null;
  payloadType: RequestTemplatePayloadType;
  preRequestScript: string | null;
  postRequestScript: string | null;
  saveInHistory: boolean;
  arguments: RequestTemplateArg[];
}

// @ts-ignore
export interface RequestTemplateView extends RequestTemplate {
  id: number;
  userId: number;
  arguments: RequestTemplateArgView[];
}
