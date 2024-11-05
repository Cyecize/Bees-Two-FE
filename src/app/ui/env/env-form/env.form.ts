import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  languages: FormArray<FormGroup<EnvLanguageForm>>;
}

export interface EnvLanguageForm {
  languageCode: FormControl<string>;
  defaultLanguage: FormControl<boolean>;
}
