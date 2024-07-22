import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingDefaultConfigurationPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';
import { RewardsSettingCalculationType } from '../../../../api/rewards/settings/enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from '../../../../api/rewards/settings/enums/rewards-setting-earn-type';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../shared/form-controls/select/select.option';

interface DefaultConfigurationForm {
  initialBalance: FormControl<number>;
  redeemLimit: FormControl<number>;
  earnLimit: FormControl<number>;
  calculationType: FormControl<RewardsSettingCalculationType>;
  freeGoodEnabled: FormControl<boolean>;
  earnType: FormControl<RewardsSettingEarnType>;
  pricePerPoint: FormControl<number>;
  pricePerPointEnabled: FormControl<boolean>;
}

@Component({
  selector: 'app-default-configuration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    CheckboxComponent,
    SelectComponent,
  ],
  templateUrl: './default-configuration-form.component.html',
  styleUrls: ['./default-configuration-form.component.scss'],
})
export class DefaultConfigurationFormComponent implements OnInit {
  private _existingSetting!: RewardSetting;
  form!: FormGroup<DefaultConfigurationForm>;

  calculationTypes: SelectOption[] = [];
  earnTypes: SelectOption[] = [];

  @Input()
  set existingSetting(value: RewardSetting) {
    this._existingSetting = value;
    if (this.form) {
      this.form.patchValue(value);
    }
  }

  get existingSetting(): RewardSetting {
    return this._existingSetting;
  }

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingDefaultConfigurationPayload> =
    new EventEmitter<RewardsSettingDefaultConfigurationPayload>();

  ngOnInit(): void {
    this.calculationTypes = Object.keys(RewardsSettingCalculationType).map(
      (value) => new SelectOptionKey(value),
    );

    this.earnTypes = Object.keys(RewardsSettingEarnType).map(
      (value) => new SelectOptionKey(value),
    );

    this.form = new FormGroup<DefaultConfigurationForm>({
      initialBalance: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      redeemLimit: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      earnLimit: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      calculationType: new FormControl(RewardsSettingCalculationType.TOTAL, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      freeGoodEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      earnType: new FormControl(RewardsSettingEarnType.INVOICE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      pricePerPoint: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      pricePerPointEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.existingSetting) {
      console.log(this.existingSetting);
      this.form.patchValue(this.existingSetting);
    }
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit(this.form.getRawValue());
  }
}
