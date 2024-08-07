import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  LineItemScaledDiscountOutputForm,
  LineItemScaledDiscountOutputRangeForm,
  OutputForm,
} from '../deal-forms';
import {
  Deal,
  LineItemScaledDiscountOutputRange,
} from '../../../../../api/deals/deal';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';

@Component({
  selector: 'app-line-item-scaled-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './line-item-scaled-discount-output-form.component.html',
  styleUrl: './line-item-scaled-discount-output-form.component.scss',
})
export class LineItemScaledDiscountOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  types: SelectOption[] = [];

  ngOnInit(): void {
    const chooseOne = [new SelectOptionKey('Choose one', true)];

    this.types = chooseOne.concat(
      Object.keys(DealDiscountType).map((val) => new SelectOptionKey(val)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addItemScaledForm(): void {
    this.form.addControl(
      'lineItemScaledDiscount',
      new FormGroup<LineItemScaledDiscountOutputForm>({
        ranges: new FormArray<FormGroup<LineItemScaledDiscountOutputRangeForm>>(
          [],
          Validators.required,
        ),
        vendorItemIds: new FormArray<FormControl<string>>(
          [],
          Validators.required,
        ),
      }),
    );
  }

  get itemScaledForm(): FormGroup<LineItemScaledDiscountOutputForm> {
    // @ts-ignore
    return this.form.controls.lineItemScaledDiscount;
  }

  hasItemScaledForm(): boolean {
    return this.form.contains('lineItemScaledDiscount');
  }

  removeLineItemScaledForm(): void {
    this.form.removeControl('lineItemScaledDiscount');
  }

  get vendorItems(): FormArray<FormControl<string>> {
    return this.itemScaledForm.controls.vendorItemIds;
  }

  addVendorItem(sku?: string): void {
    this.vendorItems.push(
      new FormControl<string>(sku!, {
        nonNullable: true,
        validators: Validators.required,
      }),
    );
  }

  removeVendorItem(ind: number): void {
    this.vendorItems.removeAt(ind);
  }

  get ranges(): FormArray<FormGroup<LineItemScaledDiscountOutputRangeForm>> {
    return this.itemScaledForm.controls.ranges;
  }

  addRange(range?: LineItemScaledDiscountOutputRange): void {
    const formGroup = new FormGroup<LineItemScaledDiscountOutputRangeForm>({
      from: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      to: new FormControl<number | null>(null),
      proportion: new FormControl<number | null>(null),
      maxQuantity: new FormControl<number | null>(null),
      value: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      type: new FormControl<DealDiscountType>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });

    if (range) {
      formGroup.patchValue(range);
    }

    this.ranges.push(formGroup);
  }

  removeRange(ind: number): void {
    this.ranges.removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output.lineItemScaledDiscount) {
      return;
    }

    this.addItemScaledForm();
    this.itemScaledForm.patchValue(deal.output.lineItemScaledDiscount);

    deal.output.lineItemScaledDiscount.ranges.forEach((range) => {
      this.addRange(range);
    });
    deal.output.lineItemScaledDiscount.vendorItemIds.forEach((item) => {
      this.addVendorItem(item);
    });
  }
}
