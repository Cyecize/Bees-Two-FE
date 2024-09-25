import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RewardsSettingType } from '../../../api/rewards/settings/enums/rewards-setting-type';
import { RewardsSettingLevel } from '../../../api/rewards/settings/enums/rewards-setting-level';
import { RewardsTierLevel } from '../../../api/rewards/rewards-tier-level';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';
import { BenefitsBannerFormComponent } from './benefits-banner-form/benefits-banner-form.component';
import { NgIf } from '@angular/common';
import {
  RewardsSettingMetaPayload,
  RewardsSettingPayload,
} from '../../../api/rewards/settings/payloads/rewards-setting.payload';
import { HubHeaderFormComponent } from './hub-header-form/hub-header-form.component';
import { BeesBankFormComponent } from './bees-bank-form/bees-bank-form.component';
import { TogglesFormComponent } from './toggles-form/toggles-form.component';
import { EnrollmentPageFormComponent } from './enrollment-page-form/enrollment-page-form.component';
import { TermsAndConditionsFormComponent } from './terms-and-conditions-form/terms-and-conditions-form.component';
import { RulesFormComponent } from './rules-form/rules-form.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { DefaultConfigurationFormComponent } from './default-configuration-form/default-configuration-form.component';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { OverrideAuthTokenFieldComponent } from '../../env/token/override-auth-token-field/override-auth-token-field.component';

export interface MetaForm {
  settingId: FormControl<string>;
  type: FormControl<RewardsSettingType>;
  level: FormControl<RewardsSettingLevel>;
  tier: FormControl<RewardsTierLevel>;
}

export interface RewardsSettingsFormOutput {
  meta: RewardsSettingMetaPayload;
  setting: RewardsSettingPayload;
  env?: CountryEnvironmentModel;
  authTokenOverride?: string;
}

@Component({
  selector: 'app-rewards-settings-form',
  standalone: true,
  imports: [
    SelectSearchComponent,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    BenefitsBannerFormComponent,
    NgIf,
    HubHeaderFormComponent,
    BeesBankFormComponent,
    TogglesFormComponent,
    EnrollmentPageFormComponent,
    TermsAndConditionsFormComponent,
    RulesFormComponent,
    CategoriesFormComponent,
    FilterFormComponent,
    DefaultConfigurationFormComponent,
    FormsModule,
    EnvOverrideFieldComponent,
    OverrideAuthTokenFieldComponent,
  ],
  templateUrl: './rewards-settings-form.component.html',
  styleUrl: './rewards-settings-form.component.scss',
})
export class RewardsSettingsFormComponent implements OnInit {
  private _setting!: RewardSetting;

  selectedEnv?: CountryEnvironmentModel;
  overrideAuthToken: string | undefined = '';

  tiers: SelectOption[] = [];
  types: SelectOption[] = [];
  levels: SelectOption[] = [];

  metaForm!: FormGroup<MetaForm>;
  currentType = RewardsSettingType.DEFAULT_CONFIGURATION;
  settingTypes = RewardsSettingType;

  @Input()
  typesDisabled = false;

  @Input()
  raw = false;

  rawJson = '';

  @Input()
  set setting(value: RewardSetting) {
    this._setting = value;
    if (this.metaForm) {
      this.patchSetting();
    }
  }

  get setting(): RewardSetting {
    return this._setting;
  }

  @Output()
  formSubmitted: EventEmitter<RewardsSettingsFormOutput> =
    new EventEmitter<RewardsSettingsFormOutput>();

  constructor(private envOverrideService: EnvOverrideService) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    this.tiers = Object.keys(RewardsTierLevel).map(
      (value) => new SelectOptionKey(value),
    );
    this.types = Object.keys(RewardsSettingType).map(
      (value) => new SelectOptionKey(value),
    );
    this.levels = Object.keys(RewardsSettingLevel).map(
      (value) => new SelectOptionKey(value),
    );

    this.envOverrideService.envOverride$.subscribe((value) => {
      this.selectedEnv = value;
      this.reloadData();
      //TODO: unsubscribe from this
    });

    this.metaForm.valueChanges.subscribe((value) => {
      if (value.type) {
        this.currentType = value.type;
      }
    });

    this.patchSetting();
  }

  private reloadData(): void {}

  private createForm(): void {
    this.metaForm = new FormGroup<MetaForm>({
      settingId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl<RewardsSettingType>(this.currentType, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      level: new FormControl<RewardsSettingLevel>(RewardsSettingLevel.ZONE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tier: new FormControl<RewardsTierLevel>(RewardsTierLevel.CLUB_B, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.patchSetting();
  }

  private patchSetting(): void {
    if (this.setting) {
      this.metaForm.patchValue(this.setting);

      const settingCopy = { ...this.setting };
      // @ts-ignore
      delete settingCopy.settingId;
      // @ts-ignore
      delete settingCopy.level;
      // @ts-ignore
      delete settingCopy.tier;
      // @ts-ignore
      delete settingCopy.type;

      this.rawJson = JSON.stringify(settingCopy, null, 2);
    }
  }

  onFormSubmit(value: RewardsSettingPayload): void {
    this.formSubmitted.emit({
      meta: this.metaForm.getRawValue(),
      setting: value,
      env: this.selectedEnv,
      authTokenOverride: this.overrideAuthToken,
    });
  }

  onRawFormSubmit(): void {
    let data;
    try {
      data = JSON.parse(this.rawJson);
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    this.formSubmitted.emit({
      meta: this.metaForm.getRawValue(),
      setting: data,
      env: this.selectedEnv,
      authTokenOverride: this.overrideAuthToken,
    });
  }
}
