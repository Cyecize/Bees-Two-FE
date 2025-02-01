import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BeesParam } from '../common/bees-param';
import { CountryEnvironmentModel } from '../env/country-environment.model';

export interface RequestHistory {
  id: number;
  templateId?: number;
  env: CountryEnvironmentModel;
  entity: BeesEntity;
  endpoint: string;
  method: RequestMethod;
  queryParams: BeesParam[];
  headers: BeesParam[];
  payload?: string;
  requestTraceId: string;
  dateTime: string;
  userId: number;
  responseStatus: number;
  response?: string;
}
