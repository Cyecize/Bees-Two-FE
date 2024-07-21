import { Component, OnInit } from '@angular/core';
import { RewardsSettingsFormComponent } from '../rewards-settings-form/rewards-settings-form.component';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { EmptyPage, Page, PageImpl } from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';

@Component({
  selector: 'app-rewards-settings-create',
  standalone: true,
  imports: [RewardsSettingsFormComponent, SelectSearchComponent],
  templateUrl: './rewards-settings-create.component.html',
  styleUrl: './rewards-settings-create.component.scss',
})
export class RewardsSettingsCreateComponent {}

export const CREATE_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: RewardsSettingsCreateComponent,
  },
];
