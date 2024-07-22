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
import { RewardsSettingBeesBankPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface BeesBankForm {
  web: FormGroup<PlatformForm>;
  android: FormGroup<PlatformForm>;
  ios: FormGroup<PlatformForm>;
}

interface PlatformForm {
  imageUrl: FormControl<string>;
  linkUrl: FormControl<string>;
}

@Component({
  selector: 'app-bees-bank-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './bees-bank-form.component.html',
  styleUrls: ['./bees-bank-form.component.scss'],
})
export class BeesBankFormComponent implements OnInit {
  form!: FormGroup<BeesBankForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingBeesBankPayload> =
    new EventEmitter<RewardsSettingBeesBankPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<BeesBankForm>({
      web: new FormGroup<PlatformForm>({
        imageUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        linkUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      android: new FormGroup<PlatformForm>({
        imageUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        linkUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      ios: new FormGroup<PlatformForm>({
        imageUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        linkUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    if (this.existingSetting?.beesBank) {
      this.form.patchValue(this.existingSetting.beesBank);
    }
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit({
      beesBank: this.form.getRawValue(),
    });
  }
}
