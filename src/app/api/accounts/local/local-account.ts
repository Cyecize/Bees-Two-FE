import { CountryEnvironmentModel } from '../../env/country-environment.model';

/**
 * @monaco
 */
export interface LocalAccount {
  name: string;
  envId: number;
  env: CountryEnvironmentModel;
  beesId: string;
  customerAccountId: string;
  vendorAccountId: string;
}
