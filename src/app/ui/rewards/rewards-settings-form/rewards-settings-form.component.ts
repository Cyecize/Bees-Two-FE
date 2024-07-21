import { Component, Input, OnInit } from '@angular/core';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { EmptyPage, Page, PageImpl } from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RewardsSettingType } from '../../../api/rewards/settings/rewards-setting-type';
import { RewardsSettingLevel } from '../../../api/rewards/settings/rewards-setting-level';
import { RewardsTierLevel } from '../../../api/rewards/rewards-tier-level';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';

export interface MetaForm {
  settingId: FormControl<string>;
  type: FormControl<RewardsSettingType>;
  level: FormControl<RewardsSettingLevel>;
  tier: FormControl<RewardsTierLevel>;
}

@Component({
  selector: 'app-rewards-settings-form',
  standalone: true,
  imports: [
    SelectSearchComponent,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './rewards-settings-form.component.html',
  styleUrl: './rewards-settings-form.component.scss',
})
export class RewardsSettingsFormComponent implements OnInit {
  private _setting!: RewardSetting;

  environments: Page<SelectSearchItem<CountryEnvironmentModel>> =
    new EmptyPage();

  @Input()
  selectedEnv?: CountryEnvironmentModel;
  tiers: SelectOption[] = [];
  types: SelectOption[] = [];
  levels: SelectOption[] = [];

  metaForm!: FormGroup<MetaForm>;

  @Input()
  set setting(value: RewardSetting) {
    this._setting = value;
    this.metaForm.patchValue(this._setting);
  }

  constructor(private envService: CountryEnvironmentService) {}

  async ngOnInit(): Promise<void> {
    this.tiers = Object.keys(RewardsTierLevel).map(
      (value) => new SelectOptionKey(value),
    );
    this.types = Object.keys(RewardsSettingType).map(
      (value) => new SelectOptionKey(value),
    );
    this.levels = Object.keys(RewardsSettingLevel).map(
      (value) => new SelectOptionKey(value),
    );

    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.selectedEnv = undefined;
        this.reloadData();
      }
    });

    this.environments = new PageImpl(
      (await this.envService.getEnvs()).map(
        (env) => new SelectSearchItemImpl(env.envName, env.id, env),
      ),
    );

    this.metaForm = new FormGroup<MetaForm>({
      settingId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl<RewardsSettingType>(
        RewardsSettingType.DEFAULT_CONFIGURATION,
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      level: new FormControl<RewardsSettingLevel>(RewardsSettingLevel.ZONE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tier: new FormControl<RewardsTierLevel>(RewardsTierLevel.CLUB_B, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.setting) {
      this.metaForm.patchValue(this.setting);
    }
  }

  envSelected(env: SelectSearchItem<CountryEnvironmentModel>): void {
    if (env.objRef) {
      this.selectedEnv = env.objRef;
      this.reloadData();
    }
  }

  private reloadData(): void {}
}
