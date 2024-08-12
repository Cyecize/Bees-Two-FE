import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DealsFormComponent } from '../../deals/deals-form/deals-form.component';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { ConditionAmountsFormComponent } from '../../deals/deals-form/condition-amounts-form/condition-amounts-form.component';
import { ConditionDatetimeSimulationFormComponent } from '../../deals/deals-form/condition-datetime-simulation-form/condition-datetime-simulation-form.component';
import { ConditionDeliveryDateFormComponent } from '../../deals/deals-form/condition-delivery-date-form/condition-delivery-date-form.component';
import { ConditionLineItemFormComponent } from '../../deals/deals-form/condition-line-item-form/condition-line-item-form.component';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { LineItemScaledDiscountOutputFormComponent } from '../../deals/deals-form/line-item-scaled-discount-output-form/line-item-scaled-discount-output-form.component';
import { MultiLineItemScaledByQtyOutputFormComponent } from '../../deals/deals-form/multi-line-item-scaled-by-qty-output-form/multi-line-item-scaled-by-qty-output-form.component';
import { MultiLineItemScaledDiscountOutputFormComponent } from '../../deals/deals-form/multi-line-item-scaled-discount-output-form/multi-line-item-scaled-discount-output-form.component';
import { MultipleLineItemConditionFormComponent } from '../../deals/deals-form/multiple-line-item-condition-form/multiple-line-item-condition-form.component';
import { MultipleLineItemOutputFormComponent } from '../../deals/deals-form/multiple-line-item-output-form/multiple-line-item-output-form.component';
import { NgForOf, NgIf } from '@angular/common';
import { PromoType } from '../../../../api/promo/promo-type';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PromoService } from '../../../../api/promo/promo.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../shared/form-controls/select/select.option';
import { PromoV3Payload } from '../../../../api/promo/promo-v3.payload';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { DialogService } from '../../../../shared/dialog/dialog.service';

export interface PromoV3Form {
  vendorPromotionId: FormControl<string>;
  title: FormControl<string>;
  description?: FormControl<string | null>;
  type: FormControl<PromoType>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  image?: FormControl<string | null>;
  budget?: FormControl<number | null>;
  quantityLimit?: FormControl<number | null>;
  defaultLanguage?: FormControl<string | null>; //TODO: custom data type for lang (eg. en-US)
}

@Component({
  selector: 'app-add-promotion',
  standalone: true,
  imports: [
    DealsFormComponent,
    CheckboxComponent,
    ConditionAmountsFormComponent,
    ConditionDatetimeSimulationFormComponent,
    ConditionDeliveryDateFormComponent,
    ConditionLineItemFormComponent,
    EnvOverrideFieldComponent,
    InputComponent,
    LineItemScaledDiscountOutputFormComponent,
    MultiLineItemScaledByQtyOutputFormComponent,
    MultiLineItemScaledDiscountOutputFormComponent,
    MultipleLineItemConditionFormComponent,
    MultipleLineItemOutputFormComponent,
    NgForOf,
    ReactiveFormsModule,
    SelectComponent,
    NgIf,
    FormsModule,
  ],
  templateUrl: './add-promotion.component.html',
  styleUrl: './add-promotion.component.scss',
})
export class AddPromotionComponent implements OnInit, OnDestroy {
  form!: FormGroup<PromoV3Form>;

  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  promoTypes: SelectOption[] = [];

  raw = false;
  rawJson = '';

  constructor(
    private promoService: PromoService,
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.promoTypes = [new SelectOptionKey('Select One', true)].concat(
      Object.keys(PromoType).map((val) => new SelectOptionKey(val)),
    );

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
    });

    this.form = new FormGroup<PromoV3Form>({
      vendorPromotionId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      description: new FormControl<string | null>(null),
      title: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      type: new FormControl<PromoType>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      startDate: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      endDate: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      image: new FormControl<string | null>(null),
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async formSubmitted(): Promise<void> {
    await this.submitPromo(this.form.getRawValue());
  }

  async onRawFormSubmit(): Promise<void> {
    let data: PromoV3Payload;
    try {
      data = JSON.parse(`[${this.rawJson}]`) as PromoV3Payload;
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    await this.submitPromo(data);
  }

  @ShowLoader()
  private async submitPromo(payload: PromoV3Payload): Promise<void> {
    const res = await this.promoService.addPromo([payload], this.envOverride);
    this.dialogService.openRequestResultDialog(res);
  }
}

export const ADD_PROMOTION_ROUTES: Routes = [
  {
    path: '',
    component: AddPromotionComponent,
  },
];
