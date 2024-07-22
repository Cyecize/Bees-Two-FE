import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { NgForOf } from '@angular/common';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingHubHeaderPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface HubHeaderForm {
  web: FormGroup<PlatformForm>;
  android: FormGroup<PlatformForm>;
  ios: FormGroup<PlatformForm>;
}

interface PlatformForm {
  image: FormControl<string>;
  icon: FormControl<string>;
}

@Component({
  selector: 'app-hub-header-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './hub-header-form.component.html',
  styleUrls: ['./hub-header-form.component.scss'],
})
export class HubHeaderFormComponent implements OnInit {
  form!: FormGroup<HubHeaderForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingHubHeaderPayload> =
    new EventEmitter<RewardsSettingHubHeaderPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<HubHeaderForm>({
      web: new FormGroup<PlatformForm>({
        image: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        icon: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      android: new FormGroup<PlatformForm>({
        image: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        icon: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      ios: new FormGroup<PlatformForm>({
        image: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        icon: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    if (this.existingSetting?.hubHeader) {
      this.form.patchValue(this.existingSetting.hubHeader);
    }
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit({
      hubHeader: this.form.getRawValue(),
    });
  }
}
