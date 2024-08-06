import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AmountConditionForm, ConditionsForm } from '../deal-forms';
import { AmountCondition, Deal } from '../../../../../api/deals/deal';
import { DealConditionAmountScope } from '../../../../../api/deals/enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from '../../../../../api/deals/enums/deal-condition-amount-operator';
import { DealConditionAmountField } from '../../../../../api/deals/enums/deal-condition-amount-field';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../../shared/form-controls/select/select.option';

@Component({
  selector: 'app-condition-amounts-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './condition-amounts-form.component.html',
  styleUrl: './condition-amounts-form.component.scss',
})
export class ConditionAmountsFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  scopes: SelectOption[] = [];
  fields: SelectOption[] = [];
  operators: SelectOption[] = [];

  ngOnInit(): void {
    const chooseOpt = [new SelectOptionKey('Choose one', true)];

    this.scopes = chooseOpt.concat(
      Object.keys(DealConditionAmountScope).map(
        (val) => new SelectOptionKey(val),
      ),
    );
    this.fields = chooseOpt.concat(
      Object.keys(DealConditionAmountField).map(
        (val) => new SelectOptionKey(val),
      ),
    );
    this.operators = chooseOpt.concat(
      Object.keys(DealConditionAmountOperator).map(
        (val) => new SelectOptionKey(val),
      ),
    );

    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get amounts(): FormArray<FormGroup<AmountConditionForm>> {
    // @ts-ignore
    return this.form.controls.amounts;
  }

  addAmount(am?: AmountCondition): void {
    if (!this.hasAmounts()) {
      this.form.addControl(
        'amounts',
        new FormArray<FormGroup<AmountConditionForm>>([]),
      );
    }

    const group = new FormGroup<AmountConditionForm>({
      scope: new FormControl<DealConditionAmountScope>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      operator: new FormControl<DealConditionAmountOperator>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      field: new FormControl<DealConditionAmountField>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      value: new FormControl<number>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });

    if (am) {
      group.patchValue(am);
    }

    this.amounts.push(group);
  }

  removeAmount(ind: number): void {
    this.amounts.removeAt(ind);
  }

  hasAmounts(): boolean {
    return this.form.contains('amounts');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.amounts) {
      return;
    }

    deal.conditions.amounts.forEach((am) => {
      this.addAmount(am);
    });
  }
}
