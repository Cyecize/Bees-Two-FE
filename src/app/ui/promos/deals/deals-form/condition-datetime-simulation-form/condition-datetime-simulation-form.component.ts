import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConditionsForm, SimulationDateTimeForm } from '../deal-forms';
import { Deal } from '../../../../../api/deals/deal';
import { InputComponent } from '../../../../../shared/form-controls/input/input.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-condition-datetime-simulation-form',
  standalone: true,
  imports: [FormsModule, InputComponent, NgIf, ReactiveFormsModule],
  templateUrl: './condition-datetime-simulation-form.component.html',
  styleUrl: './condition-datetime-simulation-form.component.scss',
})
export class ConditionDatetimeSimulationFormComponent implements OnInit {
  @Input()
  form!: FormGroup<ConditionsForm>;

  @Input()
  deal?: Deal;

  ngOnInit(): void {
    if (this.deal) {
      this.applyDeal(this.deal);
    }
  }

  addSimulationDateTime(): void {
    this.form.addControl(
      'simulationDateTime',
      new FormGroup<SimulationDateTimeForm>({
        startDateTime: new FormControl<string>('', {
          nonNullable: true,
          validators: Validators.required,
        }),
        endDateTime: new FormControl<string>('', {
          nonNullable: true,
          validators: Validators.required,
        }),
      }),
    );
  }

  hasSimulationDateTime(): boolean {
    return this.form.contains('simulationDateTime');
  }

  removeSimulationDateTime(): void {
    this.form.removeControl('simulationDateTime');
  }

  private applyDeal(deal: Deal): void {
    if (!deal.conditions?.simulationDateTime) {
      return;
    }

    this.addSimulationDateTime();
    this.form.controls.simulationDateTime?.patchValue(
      deal.conditions.simulationDateTime,
    );
  }
}
