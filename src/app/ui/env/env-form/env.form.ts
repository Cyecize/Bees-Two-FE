import { FormControl } from '@angular/forms';
import { Env } from '../../../api/env/env';

export interface EnvForm {
  envName: FormControl<string>;
  env: FormControl<Env>;
  countryCode: FormControl<string>;
  timezone: FormControl<string>;
  vendorId: FormControl<string>;
  storeId: FormControl<string>;
  clientId: FormControl<string>;
  clientSecret: FormControl<string>;
}
