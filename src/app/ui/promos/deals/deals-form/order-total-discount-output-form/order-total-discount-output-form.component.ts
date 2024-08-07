import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  OrderTotalDiscountOutputForm,
  OutputForm,
  PalletDiscountOutputForm,
} from '../deal-forms';
import { Deal } from '../../../../../api/deals/deal';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';

@Component({
  selector: 'app-order-total-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './order-total-discount-output-form.component.html',
  styleUrl: './order-total-discount-output-form.component.scss',
})
export class OrderTotalDiscountOutputFormComponent implements OnInit {
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

  get orderTotalForm(): FormGroup<PalletDiscountOutputForm> {
    // @ts-ignore
    return this.form.controls.orderTotalDiscount;
  }

  hasOrderTotal(): boolean {
    return this.form.contains('orderTotalDiscount');
  }

  addOrderTotal(): void {
    this.form.addControl(
      'orderTotalDiscount',
      new FormGroup<OrderTotalDiscountOutputForm>({
        discount: new FormControl<number | null>(null),
        proportion: new FormControl<number | null>(null),
        maxAmount: new FormControl<number | null>(null),
        type: new FormControl<DealDiscountType>(null!, {
          nonNullable: true,
          validators: Validators.required,
        }),
      }),
    );
  }

  removeOrderTotal(): void {
    this.form.removeControl('orderTotalDiscount');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.orderTotalDiscount) {
      return;
    }

    this.addOrderTotal();
    this.orderTotalForm.patchValue(deal.output.orderTotalDiscount);
  }
}
