import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';
import { BeesFormDataPayload } from './bees-form-data.payload';

export interface ProxyRequestPayload {
  targetEnv?: number;
  authTokenOverride?: string;
  entity: BeesEntity;
  endpoint: string;
  method?: RequestMethod;
  requestTraceId?: string;
  queryParams?: BeesParam[];
  headers?: BeesParam[];
  data?: any;
  formData?: BeesFormDataPayload;
  saveInHistory?: boolean;
  templateId?: number;
}
