import { Env } from './env';
import { CountryEnvironmentLanguageModel } from './country-environment-language.model';

export interface CountryEnvironmentPayload {
  envName: string;
  env: Env;
  countryCode: string;
  timezone: string;
  vendorId: string;
  storeId: string;
  clientId: string;
  clientSecret: string;
  languages: CountryEnvironmentLanguageModel[];
}
