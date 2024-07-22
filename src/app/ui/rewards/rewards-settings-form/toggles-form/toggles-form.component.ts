import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { NgForOf } from '@angular/common';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingsTogglesPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';

interface TogglesForm {
  earningByItem: FormControl<boolean | null>;
  acceptItemsCountMultiplier: FormControl<boolean | null>;
  findItemBySku: FormControl<boolean | null>;
  includeItemVariantsForEarning: FormControl<boolean | null>;
  earningByRule: FormControl<boolean | null>;
  payWithPointsEnabled: FormControl<boolean | null>;
  pwpPartialRefund: FormControl<boolean | null>;
}

interface TogglesFormGroup {
  toggles: FormGroup<TogglesForm>;
}

@Component({
  selector: 'app-toggles-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf, CheckboxComponent],
  templateUrl: './toggles-form.component.html',
  styleUrls: ['./toggles-form.component.scss'],
})
export class TogglesFormComponent implements OnInit {
  form!: FormGroup<TogglesFormGroup>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingsTogglesPayload> =
    new EventEmitter<RewardsSettingsTogglesPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<TogglesFormGroup>({
      toggles: new FormGroup<TogglesForm>({
        earningByItem: new FormControl<boolean | null>(null),
        acceptItemsCountMultiplier: new FormControl<boolean | null>(null),
        findItemBySku: new FormControl<boolean | null>(null),
        includeItemVariantsForEarning: new FormControl<boolean | null>(null),
        earningByRule: new FormControl<boolean | null>(null),
        payWithPointsEnabled: new FormControl<boolean | null>(null),
        pwpPartialRefund: new FormControl<boolean | null>(null),
      }),
    });

    if (this.existingSetting?.toggles) {
      this.form.patchValue({ toggles: this.existingSetting.toggles });
    }
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit(this.form.getRawValue());
  }
}
