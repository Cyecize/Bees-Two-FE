import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManualDiscountOutputForm, OutputForm } from '../deal-forms';
import { Deal } from '../../../../../api/deals/deal';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';
import { DealDiscountType } from '../../../../../api/deals/enums/deal-discount-type';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import { DealManualDiscountApplyTo } from '../../../../../api/deals/enums/deal-manual-discount-apply-to';

@Component({
  selector: 'app-output-manual-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './output-manual-discount-form.component.html',
  styleUrl: './output-manual-discount-form.component.scss',
})
export class OutputManualDiscountFormComponent implements OnInit {
  @Input()
  form!: FormGroup<OutputForm>;

  @Input()
  deal?: Deal;

  types: SelectOption[] = [];
  applyToOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.types = [new SelectOptionKey('Select Option', true)].concat(
      Object.keys(DealDiscountType).map((key) => new SelectOptionKey(key)),
    );

    this.applyToOptions = [new SelectOptionKey('Select Option', true)].concat(
      Object.keys(DealManualDiscountApplyTo).map(
        (key) => new SelectOptionKey(key),
      ),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get manualDiscountForm(): FormGroup<ManualDiscountOutputForm> {
    return this.form.controls.manualDiscount!;
  }

  hasManualDiscount(): boolean {
    return this.form.contains('manualDiscount');
  }

  addManualDiscount(): void {
    this.form.addControl(
      'manualDiscount',
      new FormGroup<ManualDiscountOutputForm>({
        type: new FormControl<DealDiscountType>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        maximum: new FormControl<number>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        applyTo: new FormControl<DealManualDiscountApplyTo>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeManualDiscount(): void {
    this.form.removeControl('manualDiscount');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.manualDiscount) {
      return;
    }

    this.addManualDiscount();
    this.manualDiscountForm.patchValue(deal.output.manualDiscount);
  }
}
