import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConditionsForm, LineItemConditionForm } from '../deal-forms';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { Deal } from '../../../../../api/deals/deal';

@Component({
  selector: 'app-condition-line-item-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
    CheckboxComponent,
    NgForOf,
  ],
  templateUrl: './condition-line-item-form.component.html',
  styleUrl: './condition-line-item-form.component.scss',
})
export class ConditionLineItemFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get lineItemForm(): FormGroup<LineItemConditionForm> {
    // @ts-ignore
    return this.form.controls.lineItem;
  }

  get vendorItemIds(): FormArray {
    return this.lineItemForm.controls.vendorItemIds;
  }

  hasLineItem(): boolean {
    return this.form.contains('lineItem');
  }

  addLineItem(): void {
    this.form.addControl(
      'lineItem',
      new FormGroup<LineItemConditionForm>({
        crossDiscount: new FormControl<boolean>(false),
        minimumQuantity: new FormControl<number | null>(null),
        sharedMinimumQuantity: new FormControl<boolean>(false),
        vendorItemIds: new FormArray<FormControl<string>>(
          [],
          Validators.required,
        ),
      }),
    );
  }

  removeLineItem(): void {
    this.form.removeControl('lineItem');
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
    if (!deal.conditions?.lineItem) {
      return;
    }

    this.addLineItem();
    this.lineItemForm.patchValue(deal.conditions.lineItem);

    deal.conditions.lineItem.vendorItemIds.forEach((itemId) => {
      this.addSku(itemId);
    });
  }
}
