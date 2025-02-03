import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';
import { RelayVersion } from "../relay/relay.version";

export interface RequestTemplate {
  name: string;
  entity: BeesEntity;
  dataIngestionVersion: RelayVersion | null;
  endpoint: string;
  method: RequestMethod;
  queryParams: BeesParam[];
  headers: BeesParam[];
  payloadTemplate: string | null;
  saveInHistory: boolean;
}

export interface RequestTemplateView extends RequestTemplate {
  id: number;
  userId: number;
}
