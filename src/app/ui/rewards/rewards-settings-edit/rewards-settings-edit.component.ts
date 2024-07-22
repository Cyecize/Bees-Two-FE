import { Component, OnInit } from '@angular/core';
import {
  RewardsSettingsFormComponent,
  RewardsSettingsFormOutput,
} from '../rewards-settings-form/rewards-settings-form.component';
import { ActivatedRoute, Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { RewardsSettingsService } from '../../../api/rewards/settings/rewards-settings.service';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { RouteNavigator } from '../../../shared/routing/route-navigator.service';
import { AppRoutingPath } from '../../../app-routing.path';
import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-rewards-settings-edit',
  standalone: true,
  imports: [RewardsSettingsFormComponent, SelectSearchComponent],
  templateUrl: './rewards-settings-edit.component.html',
  styleUrl: './rewards-settings-edit.component.scss',
})
export class RewardsSettingsEditComponent implements OnInit {
  settingToEdit!: RewardSetting;
  settingEnv!: CountryEnvironmentModel;

  constructor(
    private settingService: RewardsSettingsService,
    private route: ActivatedRoute,
    private envService: CountryEnvironmentService,
    private nav: RouteNavigator,
    private dialogService: DialogService,
    private rewardsSettingsService: RewardsSettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const settingId = this.route.snapshot.params['id'];
    const tier = this.route.snapshot.params['tier'];
    const level = this.route.snapshot.params['level'];
    const type = this.route.snapshot.params['type'];
    const envId = Number(this.route.snapshot.params['envId']);

    const env = await this.envService.findById(envId);
    if (!env) {
      console.warn(`No env found with id ${envId}!`);
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

    const setting = await this.settingService.findById(
      settingId,
      tier,
      level,
      type,
      env,
    );
    if (!setting) {
      console.warn(`No setting found with id ${settingId}`);
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

    this.settingEnv = env;
    this.settingToEdit = setting;
  }

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

export const EDIT_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: RewardsSettingsEditComponent,
  },
];
