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
import { SelectComponent } from '../../../../../shared/form-controls/select/select.component';

@Component({
  selector: 'app-condition-payment-terms-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './condition-payment-terms-form.component.html',
  styleUrl: './condition-payment-terms-form.component.scss',
})
export class ConditionPaymentTermsFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get paymentTerms(): FormArray<FormControl<number>> {
    return this.form.controls.paymentTerms!;
  }

  addPaymentTerm(val?: number): void {
    this.maybeInitPaymentTerms();
    this.paymentTerms.push(
      new FormControl<number>(val || null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  removePaymentTerm(termInd: number): void {
    this.paymentTerms.removeAt(termInd);
    if (this.paymentTerms.length < 1) {
      this.form.removeControl('paymentTerms');
    }
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.paymentTerms) {
      return;
    }

    this.maybeInitPaymentTerms();

    deal.conditions.paymentTerms.forEach((pt) => {
      this.addPaymentTerm(pt);
    });
  }

  private maybeInitPaymentTerms(): void {
    if (!this.form.controls.paymentTerms) {
      this.form.addControl(
        'paymentTerms',
        new FormArray<FormControl<number>>([]),
      );
    }
  }

  hasPaymentTerms(): boolean {
    return this.form.contains('paymentTerms');
  }
}
