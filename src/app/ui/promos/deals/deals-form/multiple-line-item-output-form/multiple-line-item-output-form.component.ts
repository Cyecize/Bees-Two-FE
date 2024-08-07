import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MultipleLineItemDiscountOutput,
  MultipleLineItemDiscountOutputItem,
  OutputForm,
} from '../deal-forms';
import {
  Deal,
  MultipleLineItemOutputItem,
} from '../../../../../api/deals/deal';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { DealComboType } from '../../../../../api/deals/enums/deal-combo-type';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';

@Component({
  selector: 'app-multiple-line-item-output-form',
  standalone: true,
  imports: [
    CheckboxComponent,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './multiple-line-item-output-form.component.html',
  styleUrl: './multiple-line-item-output-form.component.scss',
})
export class MultipleLineItemOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  comboTypes: SelectOption[] = [];
  types: SelectOption[] = [];

  ngOnInit(): void {
    const chooseOne = [new SelectOptionKey('Choose one', true)];

    this.comboTypes = chooseOne.concat(
      Object.keys(DealComboType).map((val) => new SelectOptionKey(val)),
    );
    this.types = chooseOne.concat(
      Object.keys(DealDiscountType).map((val) => new SelectOptionKey(val)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addMultipleLineItem(): void {
    this.form.addControl(
      'multipleLineItemDiscount',
      new FormGroup<MultipleLineItemDiscountOutput>({
        items: new FormArray<FormGroup<MultipleLineItemDiscountOutputItem>>(
          [],
          Validators.required,
        ),
        type: new FormControl<DealDiscountType | null>(null),
        comboType: new FormControl<DealComboType | null>(null),
        proportion: new FormControl<number | null>(null),
      }),
    );
  }

  get multipleLineItem(): FormGroup<MultipleLineItemDiscountOutput> {
    // @ts-ignore
    return this.form.controls.multipleLineItemDiscount;
  }

  hasMultipleLineItem(): boolean {
    return this.form.contains('multipleLineItemDiscount');
  }

  removeMultipleLineItem(): void {
    this.form.removeControl('multipleLineItemDiscount');
  }

  get lineItems(): FormArray<FormGroup<MultipleLineItemDiscountOutputItem>> {
    return this.multipleLineItem.controls.items;
  }

  addLineItem(item?: MultipleLineItemOutputItem): void {
    const formGroup = new FormGroup<MultipleLineItemDiscountOutputItem>({
      vendorItemId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      maxQuantity: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      value: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });

    if (item) {
      formGroup.patchValue(item);
    }

    this.lineItems.push(formGroup);
  }

  removeLineItem(itemGroupInd: number): void {
    this.lineItems.removeAt(itemGroupInd);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output.multipleLineItemDiscount) {
      return;
    }

    this.addMultipleLineItem();

    this.multipleLineItem.patchValue(deal.output.multipleLineItemDiscount);
    deal.output.multipleLineItemDiscount.items.forEach((item) => {
      this.addLineItem(item);
    });
  }
}
