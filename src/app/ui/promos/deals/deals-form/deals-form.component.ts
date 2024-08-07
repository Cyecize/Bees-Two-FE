import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  CreateDealsPayload,
  DealPayload,
} from '../../../../api/deals/payloads/create-deals.payload';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DealIdType } from '../../../../api/deals/enums/deal-id-type';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../shared/form-controls/select/select.option';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { Deal } from '../../../../api/deals/deal';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { DealAccumulationType } from '../../../../api/deals/enums/deal-accumulation-type';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import {
  ConditionsForm,
  DealForm,
  DealsForm,
  DeliveryDateForm,
  OutputForm,
} from './deal-forms';
import { ConditionLineItemFormComponent } from './condition-line-item-form/condition-line-item-form.component';
import { ConditionDatetimeSimulationFormComponent } from './condition-datetime-simulation-form/condition-datetime-simulation-form.component';
import { ConditionDeliveryDateFormComponent } from './condition-delivery-date-form/condition-delivery-date-form.component';
import { ConditionAmountsFormComponent } from './condition-amounts-form/condition-amounts-form.component';
import { MultipleLineItemConditionFormComponent } from './multiple-line-item-condition-form/multiple-line-item-condition-form.component';
import { OutputLineItemFormComponent } from './output-line-item-form/output-line-item-form.component';
import { MultipleLineItemOutputFormComponent } from './multiple-line-item-output-form/multiple-line-item-output-form.component';
import { OrderTotalScaledDiscountOutputFormComponent } from './order-total-scaled-discount-output-form/order-total-scaled-discount-output-form.component';

@Component({
  selector: 'app-deals-form',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    ReactiveFormsModule,
    NgForOf,
    SelectComponent,
    InputComponent,
    NgIf,
    FormsModule,
    CheckboxComponent,
    ConditionLineItemFormComponent,
    ConditionDatetimeSimulationFormComponent,
    ConditionDeliveryDateFormComponent,
    ConditionAmountsFormComponent,
    MultipleLineItemConditionFormComponent,
    OutputLineItemFormComponent,
    MultipleLineItemOutputFormComponent,
    OrderTotalScaledDiscountOutputFormComponent,
  ],
  templateUrl: './deals-form.component.html',
  styleUrl: './deals-form.component.scss',
})
export class DealsFormComponent implements OnInit, OnDestroy {
  private _deals: Deal[] = [];
  protected readonly DealIdType = DealIdType;
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<DealsForm>;
  dealIdTypes: SelectOption[] = [];
  accumulationTypeOptions: SelectOption[] = [];

  @Input()
  set deals(val: Deal[]) {
    this._deals = val;
    this.patchDeal(val);
  }

  get deals(): Deal[] {
    return this._deals;
  }

  @Input()
  dealIdType!: DealIdType;

  @Input()
  dealIdValue!: string;

  raw = false;

  rawJson = '';

  @Output()
  formSubmitted = new EventEmitter<CreateDealsPayload>();

  constructor(
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.dealIdTypes = Object.keys(DealIdType).map(
      (key) => new SelectOptionKey(key),
    );

    this.accumulationTypeOptions = [
      new SelectOptionKey('Select One', true),
    ].concat(
      Object.keys(DealAccumulationType).map((val) => new SelectOptionKey(val)),
    );

    this.form = new FormGroup<DealsForm>({
      ids: new FormArray<FormControl<string>>([], {
        validators: [Validators.required],
      }),
      type: new FormControl<DealIdType>(DealIdType.ACCOUNT, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      deals: new FormArray<FormGroup<DealForm>>([]),
    });

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
    });

    if (this.dealIdType) {
      this.form.controls.type.setValue(this.dealIdType);
      this.addId(this.dealIdValue);
    }
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  get ids(): FormArray {
    return this.form.controls.ids;
  }

  get dealForms(): FormArray<FormGroup<DealForm>> {
    return this.form.controls.deals;
  }

  getConditionsForm(formInd: number): FormGroup<ConditionsForm> {
    return this.dealForms.at(formInd).controls.conditions;
  }

  getOutputForm(formInd: number): FormGroup<OutputForm> {
    return this.dealForms.at(formInd).controls.output;
  }

  onRawFormSubmit(): void {
    let data: DealPayload[];
    try {
      data = JSON.parse(`[${this.rawJson}]`) as DealPayload[];
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    this.formSubmitted.emit({
      ...this.form.getRawValue(),
      deals: data,
    });
  }

  onFormSubmit(): void {
    this.formSubmitted.emit(this.form.getRawValue());
  }

  addId(id: string): void {
    this.ids.push(new FormControl<string>(id, Validators.required));
  }

  removeId(idInd: number): void {
    this.ids.removeAt(idInd);
  }

  pickAccount(): void {
    if (!this.envOverride) {
      alert('Please choose an environment first!');
      return;
    }
    this.dialogService
      .openAccountPicker(this.envOverride)
      .subscribe(async (account) => {
        if (account) {
          this.addId(account.vendorAccountId);
        }
      });
  }

  private patchDeal(val: Deal[]): void {
    if (val.length > 0) {
      const objects: string[] = [];
      val.forEach((deal) => {
        objects.push(JSON.stringify(deal, null, 2));
        this.addDeal(deal);
      });

      this.rawJson = objects.join('\n,');
    }
  }

  addDeal(deal?: Deal): void {
    this.form.controls.deals.push(
      new FormGroup<DealForm>({
        accumulationType: new FormControl<DealAccumulationType | null>(
          deal?.accumulationType || null,
        ),
        enableVariantGroupingAndConversion: new FormControl<boolean | null>(
          deal?.enableVariantGroupingAndConversion || null,
        ),
        enforced: new FormControl<boolean | null>(deal?.enforced || null),
        hiddenOnBrowse: new FormControl<boolean | null>(
          deal?.hiddenOnBrowse || null,
        ),
        hiddenOnDeals: new FormControl<boolean | null>(
          deal?.hiddenOnDeals || null,
        ),
        priority: new FormControl<number | null>(deal?.priority || null),
        level: new FormControl<number | null>(deal?.level || null),
        vendorDealId: new FormControl<string>(deal?.vendorDealId || '', {
          validators: Validators.required,
          nonNullable: true,
        }),
        vendorPromotionId: new FormControl<string>(
          deal?.vendorPromotionId || '',
          {
            validators: Validators.required,
            nonNullable: true,
          },
        ),
        conditions: new FormGroup<ConditionsForm>({
          couponCode: new FormControl<string | null>(null),
          deliveryDate: new FormArray<FormGroup<DeliveryDateForm>>([]),
          firstOrder: new FormControl<boolean | null>(null),
          paymentMethod: new FormControl<string | null>(null),
        }),
        output: new FormGroup<OutputForm>({}),
      }),
    );
  }

  removeDeal(dealInd: number): void {
    this.dealForms.removeAt(dealInd);
  }

  maybeGetDeal(formInd: number): Deal | undefined {
    return this.deals[formInd];
  }
}
