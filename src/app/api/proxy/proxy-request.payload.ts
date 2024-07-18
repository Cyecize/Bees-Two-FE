import { BeesEntity } from './bees-entity';
import { RequestMethod } from './request-method';
import { BeesParamPayload } from './bees-param.payload';

export interface ProxyRequestPayload {
  targetEnv?: number;
  entity: BeesEntity;
  endpoint: string;
  method?: RequestMethod;
  requestTraceId?: string;
  queryParams?: BeesParamPayload[];
  headers?: BeesParamPayload[];
  data?: any;
}
