import { Env } from './env';

export interface CountryEnvironmentModel {
  id: number;
  envName: string;
  env: Env;
  countryCode: string;
  vendorId: string;
  storeId: string;
}
