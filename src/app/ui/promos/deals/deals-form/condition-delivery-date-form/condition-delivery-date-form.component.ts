import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConditionsForm, DeliveryDateForm } from '../deal-forms';
import { Deal, DeliveryDateCondition } from '../../../../../api/deals/deal';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-condition-delivery-date-form',
  standalone: true,
  imports: [FormsModule, InputComponent, NgForOf, NgIf, ReactiveFormsModule],
  templateUrl: './condition-delivery-date-form.component.html',
  styleUrl: './condition-delivery-date-form.component.scss',
})
export class ConditionDeliveryDateFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addDeliveryDate(dd?: DeliveryDateCondition): void {
    this.maybeInitDeliveryDateForm();
    const group = new FormGroup<DeliveryDateForm>({
      startDate: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      endDate: new FormControl<string | null>(null),
    });

    if (dd) {
      group.patchValue(dd);
    }
    this.deliveryDateForms.push(group);
  }

  get deliveryDateForms(): FormArray<FormGroup<DeliveryDateForm>> {
    return this.form.controls.deliveryDate!;
  }

  removeDeliveryDate(ind: number): void {
    this.maybeInitDeliveryDateForm();
    this.deliveryDateForms.removeAt(ind);
    if (this.deliveryDateForms.length < 1) {
      this.form.removeControl('deliveryDate');
    }
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.deliveryDate) {
      return;
    }

    this.maybeInitDeliveryDateForm();

    deal.conditions.deliveryDate.forEach((dd) => {
      this.addDeliveryDate(dd);
    });
  }

  private maybeInitDeliveryDateForm(): void {
    if (!this.form.controls.deliveryDate) {
      this.form.addControl(
        'deliveryDate',
        new FormArray<FormGroup<DeliveryDateForm>>([]),
      );
    }
  }

  hasDeliveryDate(): boolean {
    return this.form.contains('deliveryDate');
  }
}
