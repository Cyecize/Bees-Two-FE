import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf } from '@angular/common';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { BeesDeliveryMethod } from '../../../api/common/bees.delivery.method';
import { AssortmentInclusionFormResult } from './assortment-inclusion-form.result';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';

interface AssortmentInclusionForm {
  deliveryCenterIds: FormArray<FormControl<string>>;
  assortments: FormArray<FormGroup<AssortmentForm>>;
}

interface AssortmentForm {
  deliveryMethods: FormArray<FormControl<BeesDeliveryMethod>>;
  quantityMultiplier: FormControl<number | null>;
  rank: FormControl<number | null>;
  vendorItemId: FormControl<string>;
}

@Component({
  selector: 'app-assortment-inclusion-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgForOf,
    ReactiveFormsModule,
    EnvOverrideFieldComponent,
    SelectComponent,
  ],
  templateUrl: './assortment-inclusion-form.component.html',
  styleUrl: './assortment-inclusion-form.component.scss',
})
export class AssortmentInclusionFormComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<AssortmentInclusionForm>;
  deliveryMethodOptions: SelectOption[] = [];

  @Output()
  formSubmitted = new EventEmitter<AssortmentInclusionFormResult>();

  constructor(private envOverrideService: EnvOverrideService) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      if (!ObjectUtils.isNil(this.envOverride)) {
        // this.reloadFilters();
      }
    });

    this.deliveryMethodOptions = [
      new SelectOptionKey('Choose one', true),
    ].concat(
      Object.keys(BeesDeliveryMethod).map((val) => new SelectOptionKey(val)),
    );

    this.form = new FormGroup<AssortmentInclusionForm>({
      deliveryCenterIds: new FormArray<FormControl<string>>([], {
        validators: [Validators.required],
      }),
      assortments: new FormArray<FormGroup<AssortmentForm>>([], {
        validators: [Validators.required],
      }),
    });

    // Initial setup if you have data to patch
    // this.form.patchValue(initialData);
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  get deliveryCenterIds(): FormArray {
    return this.form.controls.deliveryCenterIds;
  }

  get assortments(): FormArray {
    return this.form.controls.assortments;
  }

  getDeliveryMethods(assortmentIndex: number): FormArray {
    return this.assortments
      .at(assortmentIndex)
      ?.get('deliveryMethods') as FormArray;
  }

  addDeliveryCenterId(): void {
    this.deliveryCenterIds.push(new FormControl('', Validators.required));
  }

  removeDeliveryCenterId(index: number): void {
    this.deliveryCenterIds.removeAt(index);
  }

  addAssortment(val?: { vendorItemId: string; multiplier?: number }): void {
    this.assortments.push(
      new FormGroup({
        quantityMultiplier: new FormControl<number | null>(
          val?.multiplier || null,
        ),
        rank: new FormControl<number | null>(null),
        vendorItemId: new FormControl(val?.vendorItemId, Validators.required),
        deliveryMethods: new FormArray([]),
      }),
    );
  }

  removeAssortment(index: number): void {
    this.assortments.removeAt(index);
  }

  addDeliveryMethod(assortmentIndex: number, val: any): void {
    this.getDeliveryMethods(assortmentIndex).push(
      new FormControl(val, Validators.required),
    );
  }

  removeDeliveryMethod(assortmentIndex: number, methodIndex: number): void {
    this.getDeliveryMethods(assortmentIndex).removeAt(methodIndex);
  }

  async onFormSubmit(): Promise<void> {
    if (this.form.valid) {
      this.formSubmitted.emit({
        env: this.envOverride,
        payload: this.form.getRawValue(),
      });
    }
  }

  bulkAddAssortments(data: any, qtyMultiplier?: number): void {
    if (ObjectUtils.isNil(data) || !data.trim()) {
      alert('Invalid data, must be comma separated vendor item ids!');
      return;
    }

    data
      .split(',')
      .map((val: string) => val.trim())
      .forEach((val: string) => {
        this.addAssortment({
          vendorItemId: val,
          multiplier: qtyMultiplier,
        });
      });
  }
}
