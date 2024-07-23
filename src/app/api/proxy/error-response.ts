import { BeesEntity } from './bees-entity';
import { CountryEnvironmentModel } from '../env/country-environment.model';

export interface ErrorResponse {
  status: string;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
  data?: BeesErrorResponse;
}

export interface BeesErrorResponse {
  entity: BeesEntity;
  env: CountryEnvironmentModel;
  requestTraceId: string;
  statusCode: number;
  response: any;
}
