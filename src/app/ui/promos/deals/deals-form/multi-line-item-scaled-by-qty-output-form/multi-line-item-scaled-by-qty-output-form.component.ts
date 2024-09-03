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
  MultiItemScaledByMinQtyOutputForm,
  MultiItemScaledByMinQtyOutputRangeForm,
  OutputForm,
} from '../deal-forms';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import {
  Deal,
  MultiItemScaledByMinQtyOutputRange,
} from '../../../../../api/deals/deal';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';

@Component({
  selector: 'app-multi-line-item-scaled-by-qty-output-form',
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
  templateUrl: './multi-line-item-scaled-by-qty-output-form.component.html',
  styleUrl: './multi-line-item-scaled-by-qty-output-form.component.scss',
})
export class MultiLineItemScaledByQtyOutputFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  types: SelectOption[] = [];

  ngOnInit(): void {
    const selectOne = [new SelectOptionKey('Select Option', true)];

    this.types = selectOne.concat(
      Object.keys(DealDiscountType).map((key) => new SelectOptionKey(key)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get skuSoldForm(): FormGroup<MultiItemScaledByMinQtyOutputForm> {
    // @ts-ignore
    return this.form.controls.multipleLineItemScaledDiscountSkuPool;
  }

  hasSkuSoldForm(): boolean {
    return this.form.contains('multipleLineItemScaledDiscountSkuPool');
  }

  addSkuSold(): void {
    this.form.addControl(
      'multipleLineItemScaledDiscountSkuPool',
      new FormGroup<MultiItemScaledByMinQtyOutputForm>({
        ranges: new FormArray<
          FormGroup<MultiItemScaledByMinQtyOutputRangeForm>
        >([], Validators.required),
      }),
    );
  }

  removeSkuSold(): void {
    this.form.removeControl('multipleLineItemScaledDiscountSkuPool');
  }

  addRange(range?: MultiItemScaledByMinQtyOutputRange): void {
    const formGroup = new FormGroup<MultiItemScaledByMinQtyOutputRangeForm>({
      value: new FormControl<number>(null!, {
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
    });

    if (range) {
      formGroup.patchValue(range);
    }

    this.skuSoldForm.controls.ranges.push(formGroup);
  }

  get ranges(): FormArray<FormGroup<MultiItemScaledByMinQtyOutputRangeForm>> {
    return this.skuSoldForm.controls.ranges;
  }

  removeRange(ind: number): void {
    this.ranges.removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.multipleLineItemScaledDiscountSkuPool) {
      return;
    }

    this.addSkuSold();
    this.skuSoldForm.patchValue(
      deal.output.multipleLineItemScaledDiscountSkuPool,
    );

    deal.output.multipleLineItemScaledDiscountSkuPool.ranges.forEach(
      (range) => {
        this.addRange(range);
      },
    );
  }
}
