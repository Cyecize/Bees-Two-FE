import { Component } from '@angular/core';
import {
  RewardsSettingsFormComponent,
  RewardsSettingsFormOutput,
} from '../rewards-settings-form/rewards-settings-form.component';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { RewardsSettingPayload } from '../../../api/rewards/settings/payloads/rewards-setting.payload';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { RewardsSettingsService } from '../../../api/rewards/settings/rewards-settings.service';

@Component({
  selector: 'app-rewards-settings-create',
  standalone: true,
  imports: [RewardsSettingsFormComponent, SelectSearchComponent],
  templateUrl: './rewards-settings-create.component.html',
  styleUrl: './rewards-settings-create.component.scss',
})
export class RewardsSettingsCreateComponent {
  constructor(
    private dialogService: DialogService,
    private rewardsSettingsService: RewardsSettingsService,
  ) {}

  onFormSubmit(value: RewardsSettingsFormOutput): void {
    this.dialogService
      .openConfirmDialog(
        `You are about to execute and update to ${value?.env?.envName}`,
      )
      .subscribe(async (confirmed) => {
        if (confirmed) {
          const response = await this.rewardsSettingsService.upsert(value);
          this.dialogService.openConfirmDialog(
            `Operation completed with status ${response.statusCode}`,
          );
        }
      });
  }
}

export const CREATE_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: RewardsSettingsCreateComponent,
  },
];
