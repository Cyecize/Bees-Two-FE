import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConditionsForm } from '../deal-forms';
import { Deal } from '../../../../../api/deals/deal';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { DealChargeType } from '../../../../../api/deals/enums/deal-charge-type';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';

@Component({
  selector: 'app-condition-charge-type-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './condition-charge-type-form.component.html',
  styleUrl: './condition-charge-type-form.component.scss',
})
export class ConditionChargeTypeFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  chargeTypeOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.chargeTypeOptions = [new SelectOptionKey('Select One', true)].concat(
      Object.keys(DealChargeType).map((val) => new SelectOptionKey(val)),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get chargeTypes(): FormArray<FormControl<DealChargeType>> {
    return this.form.controls.chargeType!;
  }

  addChargeType(chargeType?: DealChargeType): void {
    this.maybeInitChargeType();
    this.chargeTypes.push(
      new FormControl<DealChargeType>(chargeType || null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  removeChargeType(chargeInd: number): void {
    this.chargeTypes.removeAt(chargeInd);
    if (this.chargeTypes.length < 1) {
      this.form.removeControl('chargeType');
    }
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.chargeType) {
      return;
    }

    this.maybeInitChargeType();

    deal.conditions.chargeType.forEach((ct) => {
      this.addChargeType(ct);
    });
  }

  private maybeInitChargeType(): void {
    if (!this.form.controls.chargeType) {
      this.form.addControl(
        'chargeType',
        new FormArray<FormControl<DealChargeType>>([]),
      );
    }
  }

  hasChargeType(): boolean {
    return this.form.contains('chargeType');
  }
}
