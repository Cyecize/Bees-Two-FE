import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ConditionsForm,
  MultipleLineItemConditionForm,
  MultipleLineItemItemsConditionForm,
} from '../deal-forms';
import {
  Deal,
  MultipleLineItemItemCondition,
} from '../../../../../api/deals/deal';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-multiple-line-item-condition-form',
  standalone: true,
  imports: [
    CheckboxComponent,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './multiple-line-item-condition-form.component.html',
  styleUrl: './multiple-line-item-condition-form.component.scss',
})
export class MultipleLineItemConditionFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addMultipleLineItem(): void {
    this.form.addControl(
      'multipleLineItem',
      new FormGroup<MultipleLineItemConditionForm>({
        items: new FormArray<FormGroup<MultipleLineItemItemsConditionForm>>(
          [],
          Validators.required,
        ),
      }),
    );
  }

  get multipleLineItem(): FormGroup<MultipleLineItemConditionForm> {
    // @ts-ignore
    return this.form.controls.multipleLineItem;
  }

  hasMultipleLineItem(): boolean {
    return this.form.contains('multipleLineItem');
  }

  removeMultipleLineItem(): void {
    this.form.removeControl('multipleLineItem');
  }

  get lineItems(): FormArray<FormGroup<MultipleLineItemItemsConditionForm>> {
    return this.multipleLineItem.controls.items;
  }

  addLineItem(item?: MultipleLineItemItemCondition): void {
    const formGroup = new FormGroup<MultipleLineItemItemsConditionForm>({
      vendorItemIds: new FormArray<FormControl<string>>(
        [],
        Validators.required,
      ),
      minimumQuantity: new FormControl<number | null>(null),
      minimumAmount: new FormControl<number | null>(null),
    });

    if (item) {
      formGroup.patchValue(item);
      item.vendorItemIds.forEach((sku) =>
        this.addVendorItemIdToGroup(formGroup.controls.vendorItemIds, sku),
      );
    }

    this.lineItems.push(formGroup);
  }

  removeLineItem(itemId: number): void {
    this.lineItems.removeAt(itemId);
  }

  getVendorItemIds(itemId: number): FormArray<FormControl<string>> {
    return this.lineItems.at(itemId).controls.vendorItemIds;
  }

  addVendorItemId(itemGroupId: number, sku: string): void {
    this.addVendorItemIdToGroup(this.getVendorItemIds(itemGroupId), sku);
  }

  private addVendorItemIdToGroup(
    group: FormArray<FormControl<string>>,
    sku: string,
  ): void {
    group.push(
      new FormControl<string>(sku, {
        nonNullable: true,
        validators: Validators.required,
      }),
    );
  }

  removeVendorItemId(itemGroupId: number, ind: number): void {
    this.getVendorItemIds(itemGroupId).removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.multipleLineItem) {
      return;
    }

    this.addMultipleLineItem();

    deal.conditions.multipleLineItem.items.forEach((item) => {
      this.addLineItem(item);
    });
  }
}
