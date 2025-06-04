import { FormArray, FormControl } from '@angular/forms';
import { BeesEntity } from '../../../../api/common/bees-entity';
import { Env } from '../../../../api/env/env';

export interface SharedClientForm {
  name: FormControl<string>;
  clientId: FormControl<string>;
  clientSecret: FormControl<string>;
  countryCode: FormControl<string | null>;
  vendorId: FormControl<string | null>;
  env: FormControl<Env>;
  targetEntities: FormArray<FormControl<BeesEntity>>;
}
