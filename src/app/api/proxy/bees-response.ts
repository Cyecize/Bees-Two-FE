import { BeesEntity } from '../common/bees-entity';
import { CountryEnvironmentModel } from '../env/country-environment.model';

export interface BeesResponse<TResponse> {
  requestTraceId: string;
  entity: BeesEntity;
  env: CountryEnvironmentModel;
  response: TResponse;
  statusCode: number;
}
