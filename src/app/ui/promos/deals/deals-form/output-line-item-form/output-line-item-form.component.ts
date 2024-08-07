import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LineItemDiscountOutput, OutputForm } from '../deal-forms';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { Deal } from '../../../../../api/deals/deal';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';

@Component({
  selector: 'app-output-line-item-form',
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
  templateUrl: './output-line-item-form.component.html',
  styleUrl: './output-line-item-form.component.scss',
})
export class OutputLineItemFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  types: SelectOption[] = [];

  ngOnInit(): void {
    this.types = [new SelectOptionKey('Select Option', true)].concat(
      Object.keys(DealDiscountType).map((key) => new SelectOptionKey(key)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get lineItemForm(): FormGroup<LineItemDiscountOutput> {
    // @ts-ignore
    return this.form.controls.lineItemDiscount;
  }

  get vendorItemIds(): FormArray {
    return this.lineItemForm.controls.vendorItemIds;
  }

  hasLineItem(): boolean {
    return this.form.contains('lineItemDiscount');
  }

  addLineItem(): void {
    this.form.addControl(
      'lineItemDiscount',
      new FormGroup<LineItemDiscountOutput>({
        vendorItemIds: new FormArray<FormControl<string>>(
          [],
          Validators.required,
        ),
        value: new FormControl<number | null>(null),
        maxQuantity: new FormControl<number | null>(null),
        proportion: new FormControl<number | null>(null),
        type: new FormControl<DealDiscountType | null>(null),
      }),
    );
  }

  removeLineItem(): void {
    this.form.removeControl('lineItemDiscount');
  }

  addSku(sku: string): void {
    this.vendorItemIds.push(
      new FormControl<string>(sku, {
        nonNullable: true,
        validators: Validators.required,
      }),
    );
  }

  removeSku(ind: number): void {
    this.vendorItemIds.removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.lineItemDiscount) {
      return;
    }

    this.addLineItem();
    this.lineItemForm.patchValue(deal.output.lineItemDiscount);

    deal.output.lineItemDiscount.vendorItemIds.forEach((itemId) => {
      this.addSku(itemId);
    });
  }
}
