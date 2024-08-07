import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OutputForm, PalletDiscountOutputForm } from '../deal-forms';
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
  selector: 'app-pallet-discount-output-form',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './pallet-discount-output-form.component.html',
  styleUrl: './pallet-discount-output-form.component.scss',
})
export class PalletDiscountOutputFormComponent implements OnInit {
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

  get palletForm(): FormGroup<PalletDiscountOutputForm> {
    // @ts-ignore
    return this.form.controls.palletDiscount;
  }

  hasPalletForm(): boolean {
    return this.form.contains('palletDiscount');
  }

  addPallet(): void {
    this.form.addControl(
      'palletDiscount',
      new FormGroup<PalletDiscountOutputForm>({
        discount: new FormControl<number | null>(null),
        proportion: new FormControl<number | null>(null),
        measureUnit: new FormControl<string | null>(null),
      }),
    );
  }

  removePallet(): void {
    this.form.removeControl('palletDiscount');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.output?.palletDiscount) {
      return;
    }

    this.addPallet();
    this.palletForm.patchValue(deal.output.palletDiscount);
  }
}
