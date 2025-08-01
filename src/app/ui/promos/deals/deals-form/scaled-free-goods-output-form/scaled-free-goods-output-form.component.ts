import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FreeGoodItemVendorItemsForm,
  OutputForm,
  ScaledFreeGoodOutputRangeItemForm,
  ScaledFreeGoodsOutputForm,
  ScaledFreeGoodsOutputRangeForm,
} from '../deal-forms';
import {
  Deal,
  FreeGoodOutputItem,
  FreeGoodOutputItemVendorItem,
  LineItemScaledFreeGoodsRange,
} from '../../../../../api/deals/deal';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
  SelectOptionKvp,
} from '../../../../../shared/form-controls/select/select.option';
import { DealRangeTriggerType } from '../../../../../api/deals/enums/deal-range-trigger-type';

@Component({
  selector: 'app-scaled-free-goods-output-form',
  standalone: true,
  imports: [
    CheckboxComponent,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './scaled-free-goods-output-form.component.html',
  styleUrl: './scaled-free-goods-output-form.component.scss',
})
export class ScaledFreeGoodsOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  rangeTriggerTypes: SelectOption[] = [];

  ngOnInit(): void {
    const chooseOne = [new SelectOptionKvp('Choose one (Optional)', null)];

    this.rangeTriggerTypes = chooseOne.concat(
      Object.keys(DealRangeTriggerType).map((val) => new SelectOptionKey(val)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addScaledFreeGoods(): void {
    this.form.addControl(
      'scaledFreeGoods',
      new FormGroup<ScaledFreeGoodsOutputForm>({
        ranges: new FormArray<FormGroup<ScaledFreeGoodsOutputRangeForm>>(
          [],
          Validators.required,
        ),
        rangeTriggerType: new FormControl<DealRangeTriggerType | null>(null),
        partial: new FormControl<boolean | null>(null),
      }),
    );
  }

  get scaledFreeGoods(): FormGroup<ScaledFreeGoodsOutputForm> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.form.controls.scaledFreeGoods;
  }

  hasScaledFreeGoods(): boolean {
    return this.form.contains('scaledFreeGoods');
  }

  removeScaledFreeGoods(): void {
    this.form.removeControl('scaledFreeGoods');
  }

  get ranges(): FormArray<FormGroup<ScaledFreeGoodsOutputRangeForm>> {
    return this.scaledFreeGoods.controls.ranges;
  }

  addRange(range?: LineItemScaledFreeGoodsRange): void {
    const rangeForm = new FormGroup<ScaledFreeGoodsOutputRangeForm>({
      from: new FormControl<number>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      to: new FormControl<number | null>(null),
      proportion: new FormControl<number | null>(null),
      items: new FormArray<FormGroup<ScaledFreeGoodOutputRangeItemForm>>([], {
        validators: [Validators.required],
      }),
    });

    this.ranges.push(rangeForm);

    if (range) {
      rangeForm.patchValue(range);

      if (range.items?.length > 0) {
        range.items.forEach((itemRange) =>
          this.addItemToRange(rangeForm, itemRange),
        );
      }
    }
  }

  removeRange(rangeInd: number): void {
    this.ranges.removeAt(rangeInd);
  }

  getRangeItems(
    rangeInd: number,
  ): FormArray<FormGroup<ScaledFreeGoodOutputRangeItemForm>> {
    return this.ranges.at(rangeInd).controls.items;
  }

  addRangeItem(rangeInd: number): void {
    this.addItemToRange(this.ranges.at(rangeInd));
  }

  removeRangeItem(rangeInd: number, itemInd: number): void {
    this.getRangeItems(rangeInd).removeAt(itemInd);
  }

  addItemToRange(
    rangeForm: FormGroup<ScaledFreeGoodsOutputRangeForm>,
    itemRange?: FreeGoodOutputItem,
  ): void {
    const itemRangeForm = new FormGroup<ScaledFreeGoodOutputRangeItemForm>({
      quantity: new FormControl<number | null>(null),
      vendorItems: new FormArray<FormGroup<FreeGoodItemVendorItemsForm>>([], {
        validators: [Validators.required],
      }),
    });

    rangeForm.controls.items.push(itemRangeForm);

    if (itemRange) {
      itemRangeForm.patchValue(itemRange);
      if (itemRange.vendorItems) {
        itemRange.vendorItems.forEach((vendorItem) =>
          this.addVendorItem(itemRangeForm, vendorItem),
        );
      }
    }
  }

  getItemFromRange(
    rangeInd: number,
    itemInd: number,
  ): FormGroup<ScaledFreeGoodOutputRangeItemForm> {
    return this.getRangeItems(rangeInd).at(itemInd);
  }

  createVendorItemRange(rangeInd: number, itemInd: number): void {
    this.addVendorItem(this.getItemFromRange(rangeInd, itemInd));
  }

  addVendorItem(
    itemRangeForm: FormGroup<ScaledFreeGoodOutputRangeItemForm>,
    vendorItem?: FreeGoodOutputItemVendorItem,
  ): void {
    const vendorItemForm = new FormGroup<FreeGoodItemVendorItemsForm>({
      vendorItemId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl<number | null>(null),
      measureUnit: new FormControl<string | null>(null),
    });

    itemRangeForm.controls.vendorItems.push(vendorItemForm);

    if (vendorItem) {
      vendorItemForm.patchValue(vendorItem);
    }
  }

  removeVendorItem(
    rangeInd: number,
    itemInd: number,
    vendorItemInd: number,
  ): void {
    this.getItemFromRange(rangeInd, itemInd).controls.vendorItems.removeAt(
      vendorItemInd,
    );
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output.scaledFreeGoods) {
      return;
    }

    this.addScaledFreeGoods();

    this.scaledFreeGoods.patchValue(deal.output.scaledFreeGoods);
    deal.output.scaledFreeGoods.ranges.forEach((range) => {
      this.addRange(range);
    });
  }
}
