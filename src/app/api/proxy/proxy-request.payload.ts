import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParamPayload } from './bees-param.payload';

export interface ProxyRequestPayload {
  targetEnv?: number;
  authTokenOverride?: string;
  entity: BeesEntity;
  endpoint: string;
  method?: RequestMethod;
  requestTraceId?: string;
  queryParams?: BeesParamPayload[];
  headers?: BeesParamPayload[];
  data?: any;
}
