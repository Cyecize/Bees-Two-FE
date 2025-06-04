import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FreeGoodItemForm,
  FreeGoodItemVendorItemsForm,
  FreeGoodOutputForm,
  OutputForm,
} from '../deal-forms';
import {
  Deal,
  FreeGoodOutputItem,
  FreeGoodOutputItemVendorItem,
} from '../../../../../api/deals/deal';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';

@Component({
  selector: 'app-free-good-output-form',
  standalone: true,
  imports: [
    CheckboxComponent,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './free-good-output-form.component.html',
  styleUrl: './free-good-output-form.component.scss',
})
export class FreeGoodOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get freeGoods(): FormGroup<FreeGoodOutputForm> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.form.controls.freeGoods;
  }

  addFreeGood(): void {
    this.form.addControl(
      'freeGoods',
      new FormGroup<FreeGoodOutputForm>({
        items: new FormArray<FormGroup<FreeGoodItemForm>>(
          [],
          Validators.required,
        ),
        proportion: new FormControl<number | null>(null),
        proportionAmount: new FormControl<number | null>(null),
        partial: new FormControl<boolean | null>(null),
      }),
    );
  }

  get items(): FormArray<FormGroup<FreeGoodItemForm>> {
    return this.freeGoods.controls.items;
  }

  hasFreeGoods(): boolean {
    return this.form.contains('freeGoods');
  }

  removeFreeGoods(): void {
    this.form.removeControl('freeGoods');
  }

  getVendorItems(
    ind: number,
  ): FormArray<FormGroup<FreeGoodItemVendorItemsForm>> {
    return this.items.at(ind).controls.vendorItems;
  }

  removeVendorItem(itemInd: number, vendorItemInd: number): void {
    this.items.at(itemInd).controls.vendorItems.removeAt(vendorItemInd);
  }

  addVendorItem(itemInd: number): void {
    this.addVendorItemToItem(this.items.at(itemInd));
  }

  addVendorItemToItem(
    itemGroup: FormGroup<FreeGoodItemForm>,
    item?: FreeGoodOutputItemVendorItem,
  ): void {
    const form = new FormGroup<FreeGoodItemVendorItemsForm>({
      vendorItemId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl<number | null>(null),
      measureUnit: new FormControl<string | null>(null),
    });

    itemGroup.controls.vendorItems.push(form);

    if (item) {
      form.patchValue(item);
    }
  }

  addItem(item?: FreeGoodOutputItem): void {
    const formGroup = new FormGroup<FreeGoodItemForm>({
      quantity: new FormControl<number | null>(null),
      vendorItems: new FormArray<FormGroup<FreeGoodItemVendorItemsForm>>(
        [],
        Validators.required,
      ),
    });

    if (item) {
      formGroup.patchValue(item);

      item.vendorItems.forEach((vi) => {
        this.addVendorItemToItem(formGroup, vi);
      });
    }

    this.items.push(formGroup);
  }

  removeItem(itemInd: number): void {
    this.items.removeAt(itemInd);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output.freeGoods) {
      return;
    }

    this.addFreeGood();

    this.freeGoods.patchValue(deal.output.freeGoods);
    deal.output.freeGoods.items.forEach((item) => {
      this.addItem(item);
    });
  }
}
