import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChargeDiscountOutputForm, OutputForm } from '../deal-forms';
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
  selector: 'app-output-charge-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './output-charge-discount-form.component.html',
  styleUrl: './output-charge-discount-form.component.scss',
})
export class OutputChargeDiscountFormComponent implements OnInit {
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

  get chargeForm(): FormGroup<ChargeDiscountOutputForm> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.form.controls.chargeDiscount;
  }

  hasChargeForm(): boolean {
    return this.form.contains('chargeDiscount');
  }

  addChargeDiscount(): void {
    this.form.addControl(
      'chargeDiscount',
      new FormGroup<ChargeDiscountOutputForm>({
        type: new FormControl<DealDiscountType>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        discountValue: new FormControl<number>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        discountMaximumOrderValue: new FormControl<number>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeChargeDiscount(): void {
    this.form.removeControl('chargeDiscount');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.chargeDiscount) {
      return;
    }

    this.addChargeDiscount();
    this.chargeForm.patchValue(deal.output.chargeDiscount);
  }
}
