import { FormArray, FormControl } from '@angular/forms';
import { BeesEntity } from '../../../../api/common/bees-entity';
import { Env } from '../../../../api/env/env';
import { SharedClientSupportedMethod } from '../../../../api/env/sharedclient/shared-client-supported-method';

export interface SharedClientForm {
  name: FormControl<string>;
  clientId: FormControl<string>;
  clientSecret: FormControl<string>;
  countryCode: FormControl<string | null>;
  vendorId: FormControl<string | null>;
  env: FormControl<Env>;
  targetEntities: FormArray<FormControl<BeesEntity>>;
  requestMethods: FormArray<FormControl<SharedClientSupportedMethod>>;
}
