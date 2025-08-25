import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { DeliveryWindowService } from '../../../api/accounts/delivery-window/delivery-window.service';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

interface DeliveryWindowForm {
  deliveryScheduleId: FormControl<string>;
  startDate: FormControl<string>;
  expirationDate: FormControl<string>;
  endDate: FormControl<string>;
  vendorId: FormControl<string | null>;
  id: FormControl<string>;
  alternative: FormControl<boolean | null>;
}

@Component({
  selector: 'app-add-delivery-window',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    ReactiveFormsModule,
    InputComponent,
    CheckboxComponent,
    MatDatepicker,
    MatDatepickerInput,
    NgIf,
  ],
  templateUrl: './add-delivery-window.component.html',
  styleUrl: './add-delivery-window.component.scss',
})
export class AddDeliveryWindowComponent implements OnInit, OnDestroy {
  private envOverride!: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<DeliveryWindowForm>;

  constructor(
    private deliveryWindowService: DeliveryWindowService,
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (value) {
        this.envOverride = value;
      }
    });

    this.form = new FormGroup<DeliveryWindowForm>({
      deliveryScheduleId: new FormControl<string>(null!, {
        nonNullable: true,
      }),
      startDate: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      expirationDate: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      id: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vendorId: new FormControl<string | null>(null),
      alternative: new FormControl<boolean | null>(null),
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async onFormSubmit(): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        `You are about to create delivery window on env: ${this.envOverride?.envName}`,
      )
      .subscribe(async (confirmed) => {
        if (confirmed) {
          this.createDeliveryWindow();
        }
      });
  }

  @ShowLoader()
  private async createDeliveryWindow(): Promise<void> {
    const res = await this.deliveryWindowService.createDeliveryWindow(
      this.form.getRawValue(),
      this.envOverride,
    );

    this.dialogService.openRequestResultDialog(res);
  }

  startDateChanged(date: Date): void {
    const month = (date.getMonth() + 1 + '').padStart(2, '0');
    const day = (date.getDate() + '').padStart(2, '0');
    this.form.controls.startDate.patchValue(
      `${date.getFullYear()}-${month}-${day}`,
    );
  }

  expirationDateChange(date: Date): void {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
    );

    this.form.controls.expirationDate.patchValue(
      new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString(),
    );
  }

  endDateChange(date: Date): void {
    const month = (date.getMonth() + 1 + '').padStart(2, '0');
    const day = (date.getDate() + '').padStart(2, '0');
    this.form.controls.endDate.patchValue(
      `${date.getFullYear()}-${month}-${day}`,
    );

    this.updateDeliveryWindowId();
  }

  pickDeliveryScheduleId(): void {
    this.dialogService
      .openBeesAccountPicker(this.envOverride)
      .subscribe((acc) => {
        if (acc) {
          this.form.controls.deliveryScheduleId.patchValue(
            acc.deliveryScheduleId!,
          );

          if (!acc.deliveryScheduleId) {
            alert('This account has no schedule ID!');
          }

          this.updateDeliveryWindowId();
        }
      });
  }

  private updateDeliveryWindowId(): void {
    const formData = this.form.getRawValue();
    if (!ObjectUtils.isNil(formData.id)) {
      return;
    }

    if (!formData.endDate || !formData.deliveryScheduleId) {
      return;
    }

    this.form.controls.id.patchValue(
      `${formData.deliveryScheduleId}_${formData.endDate}`,
    );
  }
}

export const ADD_DELIVERY_WINDOW_ROUTES: Routes = [
  {
    path: '',
    component: AddDeliveryWindowComponent,
  },
];
