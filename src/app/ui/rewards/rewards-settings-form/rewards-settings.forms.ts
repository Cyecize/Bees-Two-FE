import { FormControl } from '@angular/forms';

export interface DefaultConfigForm {
  initialBalance: FormControl<number>;
  redeemLimit: FormControl<number>;
  earnLimit: FormControl<number>;
  calculationType: FormControl<string>;
  freeGoodEnabled: FormControl<boolean>;
  earnType: FormControl<string>;
  pricePerPoint: FormControl<number>;
  pricePerPointEnabled: FormControl<boolean>;
}

export interface TogglesForm {
  earningByRule: FormControl<boolean>;
  acceptItemsCountMultiplier: FormControl<boolean>;
  findItemBySku: FormControl<boolean>;
  includeItemVariantsForEarning: FormControl<boolean>;
}
