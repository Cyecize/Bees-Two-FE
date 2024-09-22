import { Env } from './env';

export interface CountryEnvironmentPayload {
  envName: string;
  env: Env;
  countryCode: string;
  timezone: string;
  vendorId: string;
  storeId: string;
  clientId: string;
  clientSecret: string;
}
