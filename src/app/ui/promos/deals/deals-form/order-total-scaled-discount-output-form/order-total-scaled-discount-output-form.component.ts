import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  OrderTotalScaledDiscountOutputForm,
  OrderTotalScaledDiscountOutputRangeForm,
  OutputForm,
} from '../deal-forms';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import {
  Deal,
  OrderTotalScaledDiscountOutputRange,
} from '../../../../../api/deals/deal';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';
import { DealOrderTotalApplyTo } from '../../../../../api/deals/enums/deal-order-total-apply-to';

@Component({
  selector: 'app-order-total-scaled-discount-output-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
    CheckboxComponent,
    NgForOf,
    SelectComponent,
  ],
  templateUrl: './order-total-scaled-discount-output-form.component.html',
  styleUrl: './order-total-scaled-discount-output-form.component.scss',
})
export class OrderTotalScaledDiscountOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  types: SelectOption[] = [];
  applyToOptions: SelectOption[] = [];

  ngOnInit(): void {
    const selectOne = [new SelectOptionKey('Select Option', true)];

    this.types = selectOne.concat(
      Object.keys(DealDiscountType).map((key) => new SelectOptionKey(key)),
    );

    this.applyToOptions = selectOne.concat(
      Object.keys(DealOrderTotalApplyTo).map((key) => new SelectOptionKey(key)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get orderTotalGroup(): FormGroup<OrderTotalScaledDiscountOutputForm> {
    // @ts-ignore
    return this.form.controls.orderTotalScaledDiscount;
  }

  hasOrderTotalGroup(): boolean {
    return this.form.contains('orderTotalScaledDiscount');
  }

  addOrderTotal(): void {
    this.form.addControl(
      'orderTotalScaledDiscount',
      new FormGroup<OrderTotalScaledDiscountOutputForm>({
        ranges: new FormArray<
          FormGroup<OrderTotalScaledDiscountOutputRangeForm>
        >([], Validators.required),
      }),
    );
  }

  removeOrderTotal(): void {
    this.form.removeControl('orderTotalScaledDiscount');
  }

  addRange(range?: OrderTotalScaledDiscountOutputRange): void {
    const formGroup = new FormGroup<OrderTotalScaledDiscountOutputRangeForm>({
      discount: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      from: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      to: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      type: new FormControl<DealDiscountType>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      applyTo: new FormControl<DealOrderTotalApplyTo | null>(null!),
    });

    if (range) {
      formGroup.patchValue(range);
    }

    this.orderTotalGroup.controls.ranges.push(formGroup);
  }

  get ranges(): FormArray<FormGroup<OrderTotalScaledDiscountOutputRangeForm>> {
    return this.orderTotalGroup.controls.ranges;
  }

  removeRange(ind: number): void {
    this.ranges.removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.orderTotalScaledDiscount) {
      return;
    }

    this.addOrderTotal();
    this.orderTotalGroup.patchValue(deal.output.orderTotalScaledDiscount);

    deal.output.orderTotalScaledDiscount.ranges.forEach((range) => {
      this.addRange(range);
    });
  }
}
