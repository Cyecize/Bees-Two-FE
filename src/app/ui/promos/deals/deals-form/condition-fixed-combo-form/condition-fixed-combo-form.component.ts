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
  ConditionsForm,
  FixedComboConditionForm,
  FixedComboItemConditionForm,
} from '../deal-forms';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CheckboxComponent } from '../../../../../shared/form-controls/checkbox/checkbox.component';
import { Deal, FixedComboItemsCondition } from '../../../../../api/deals/deal';

@Component({
  selector: 'app-condition-fixed-combo-form',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
    CheckboxComponent,
    NgForOf,
  ],
  templateUrl: './condition-fixed-combo-form.component.html',
  styleUrl: './condition-fixed-combo-form.component.scss',
})
export class ConditionFixedComboFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  get fixedComboForm(): FormGroup<FixedComboConditionForm> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.form.controls.fixedCombo;
  }

  get items(): FormArray<FormGroup<FixedComboItemConditionForm>> {
    return this.fixedComboForm.controls.items;
  }

  hasFixedCombo(): boolean {
    return this.form.contains('fixedCombo');
  }

  addFixedCombo(): void {
    this.form.addControl(
      'fixedCombo',
      new FormGroup<FixedComboConditionForm>({
        items: new FormArray<FormGroup<FixedComboItemConditionForm>>([], {
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeFixedCombo(): void {
    this.form.removeControl('fixedCombo');
  }

  addItem(item?: FixedComboItemsCondition): void {
    this.items.push(
      new FormGroup<FixedComboItemConditionForm>({
        vendorItemId: new FormControl<string>(item?.vendorItemId || null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        quantity: new FormControl<number>(item?.quantity || null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeItem(ind: number): void {
    this.items.removeAt(ind);
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.fixedCombo) {
      return;
    }

    this.addFixedCombo();
    this.fixedComboForm.patchValue(deal.conditions.fixedCombo);

    deal.conditions.fixedCombo.items.forEach((item) => {
      this.addItem(item);
    });
  }
}
