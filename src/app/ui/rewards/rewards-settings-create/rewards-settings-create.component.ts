import { Component } from '@angular/core';
import { RewardsSettingsFormComponent } from '../rewards-settings-form/rewards-settings-form.component';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { RewardsSettingPayload } from '../../../api/rewards/settings/payloads/rewards-setting.payload';

@Component({
  selector: 'app-rewards-settings-create',
  standalone: true,
  imports: [RewardsSettingsFormComponent, SelectSearchComponent],
  templateUrl: './rewards-settings-create.component.html',
  styleUrl: './rewards-settings-create.component.scss',
})
export class RewardsSettingsCreateComponent {
  onFormSubmit(value: RewardsSettingPayload): void {
    console.log(value);
  }
}

export const CREATE_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: RewardsSettingsCreateComponent,
  },
];
