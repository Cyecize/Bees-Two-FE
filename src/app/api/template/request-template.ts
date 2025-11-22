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
  makeRequest: boolean;
  endpoint: string | null;
  method: RequestMethod | null;
  queryParams: BeesParam[];
  headers: BeesParam[];
  payloadTemplate: string | null;
  payloadType: RequestTemplatePayloadType;
  preRequestScript: string | null;
  postRequestScript: string | null;
  saveInHistory: boolean;
  autoInit: boolean;
  arguments: RequestTemplateArg[];
}

// @ts-ignore
export interface RequestTemplateFull extends RequestTemplate {
  id: number;
  userId: number;
  isInitialized?: boolean; // Transient field
  arguments: RequestTemplateArgView[];
}

export interface RequestTemplateDtoForSearch {
  id: number;
  userId: number;
  name: string;
  entity: BeesEntity;
  makeRequest: boolean;
  dataIngestionVersion: RelayVersion | null;
  endpoint: string | null;
  method: RequestMethod | null;
  payloadType: RequestTemplatePayloadType;
  saveInHistory: boolean;
  autoInit: boolean;
}
