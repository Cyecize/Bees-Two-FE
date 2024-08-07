import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MultiLineItemScaledDiscountOutputForm,
  MultiLineItemScaledDiscountOutputRangeForm,
  MultiLineItemScaledDiscountOutputRangeItemForm,
  OutputForm,
} from '../deal-forms';
import {
  Deal,
  MultiLineItemScaledDiscountOutputRange,
  MultiLineItemScaledDiscountOutputRangeItem,
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
  selector: 'app-multi-line-item-scaled-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './multi-line-item-scaled-discount-output-form.component.html',
  styleUrl: './multi-line-item-scaled-discount-output-form.component.scss',
})
export class MultiLineItemScaledDiscountOutputFormComponent implements OnInit {
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
      'multipleLineItemScaledDiscount',
      new FormGroup<MultiLineItemScaledDiscountOutputForm>({
        ranges: new FormArray<
          FormGroup<MultiLineItemScaledDiscountOutputRangeForm>
        >([], Validators.required),
      }),
    );
  }

  get itemScaledForm(): FormGroup<MultiLineItemScaledDiscountOutputForm> {
    // @ts-ignore
    return this.form.controls.multipleLineItemScaledDiscount;
  }

  hasItemScaledForm(): boolean {
    return this.form.contains('multipleLineItemScaledDiscount');
  }

  removeLineItemScaledForm(): void {
    this.form.removeControl('multipleLineItemScaledDiscount');
  }

  get ranges(): FormArray<
    FormGroup<MultiLineItemScaledDiscountOutputRangeForm>
  > {
    return this.itemScaledForm.controls.ranges;
  }

  addRange(range?: MultiLineItemScaledDiscountOutputRange): void {
    const form = new FormGroup<MultiLineItemScaledDiscountOutputRangeForm>({
      type: new FormControl<DealDiscountType>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      from: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      to: new FormControl<number | null>(null),
      proportion: new FormControl<number | null>(null),
      items: new FormArray<
        FormGroup<MultiLineItemScaledDiscountOutputRangeItemForm>
      >([], Validators.required),
    });

    if (range) {
      form.patchValue(range);
      range.items.forEach((item) => {
        this.addItemToGroup(form.controls.items, item);
      });
    }

    this.ranges.push(form);
  }

  removeRange(rangeInd: number): void {
    this.ranges.removeAt(rangeInd);
  }

  private addItemToGroup(
    items: FormArray<FormGroup<MultiLineItemScaledDiscountOutputRangeItemForm>>,
    item?: MultiLineItemScaledDiscountOutputRangeItem,
  ): void {
    const form = new FormGroup<MultiLineItemScaledDiscountOutputRangeItemForm>({
      vendorItemId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      value: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      maxQuantity: new FormControl<number | null>(null),
    });

    if (item) {
      form.patchValue(item);
    }

    items.push(form);
  }

  addItem(rangeInd: number): void {
    this.addItemToGroup(this.getItemsForm(rangeInd));
  }

  getItemsForm(
    rangeInd: number,
  ): FormArray<FormGroup<MultiLineItemScaledDiscountOutputRangeItemForm>> {
    return this.ranges.at(rangeInd).controls.items;
  }

  removeItemsForm(rangeInd: number, itemInd: number): void {
    this.getItemsForm(rangeInd).removeAt(itemInd);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output.multipleLineItemScaledDiscount) {
      return;
    }

    this.addItemScaledForm();
    this.itemScaledForm.patchValue(deal.output.multipleLineItemScaledDiscount);

    deal.output.multipleLineItemScaledDiscount.ranges.forEach((range) => {
      this.addRange(range);
    });
  }
}
