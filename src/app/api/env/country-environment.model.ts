import { Env } from './env';
import { CountryEnvironmentLanguageModel } from './country-environment-language.model';

/**
 * @monaco
 */
export interface CountryEnvironmentModel {
  id: number;
  envName: string;
  env: Env;
  countryCode: string;
  vendorId: string;
  storeId: string;
  timezone: string;
  defaultLanguage: CountryEnvironmentLanguageModel;
  languages: CountryEnvironmentLanguageModel[];
  singleLanguage: boolean;
  createDate: string;
  updateDate: string;
}
