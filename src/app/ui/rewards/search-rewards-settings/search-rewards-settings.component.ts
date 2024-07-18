import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { EmptyPage, Page, PageImpl } from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import {
  RewardsSettingsSearchQuery,
  RewardsSettingsSearchQueryImpl,
} from '../../../api/rewards/dto/rewards-settings-search.query';
import { RewardsSettingLevel } from '../../../api/rewards/rewards-setting-level';
import { NgForOf } from '@angular/common';
import { RewardsTierLevel } from '../../../api/rewards/rewards-tier-level';
import { RewardsSettingType } from '../../../api/rewards/rewards-setting-type';
import { BeesResponse } from '../../../api/proxy/bees-response';
import { RewardsSettingsService } from '../../../api/rewards/rewards-settings.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';

@Component({
  selector: 'app-search-rewards',
  standalone: true,
  imports: [SelectSearchComponent, InputComponent, NgForOf],
  templateUrl: './search-rewards-settings.component.html',
  styleUrl: './search-rewards-settings.component.scss',
})
export class SearchRewardsSettingsComponent implements OnInit {
  levels: Page<SelectSearchItem<RewardsSettingLevel>> = new EmptyPage();
  tiers: Page<SelectSearchItem<RewardsTierLevel>> = new EmptyPage();
  types: Page<SelectSearchItem<RewardsSettingType>> = new EmptyPage();

  query: RewardsSettingsSearchQuery = new RewardsSettingsSearchQueryImpl();

  settings!: BeesResponse<any>;
  environments: Page<SelectSearchItem<CountryEnvironmentModel>> =
    new EmptyPage();
  selectedEnv?: CountryEnvironmentModel;

  constructor(
    private rewardsSettingsService: RewardsSettingsService,
    private envService: CountryEnvironmentService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.selectedEnv = undefined;
        this.reloadFilters();
      }
    });

    this.envService.getAllEnvs().subscribe((value) => {
      this.environments = new PageImpl(
        value.map((env) => new SelectSearchItemImpl(env.envName, env.id, env)),
      );
    });
  }

  levelSelected(levelSelection: SelectSearchItem<RewardsSettingLevel>): void {
    if (
      levelSelection.objRef &&
      !this.query.levels.includes(levelSelection.objRef)
    ) {
      this.query.levels.push(levelSelection.objRef);
      this.reloadFilters();
    }
  }

  removeLevel(level: RewardsSettingLevel): void {
    this.query.levels.splice(this.query.levels.indexOf(level), 1);
    this.reloadFilters();
  }

  tierSelected(tierSelection: SelectSearchItem<RewardsTierLevel>): void {
    if (
      tierSelection.objRef &&
      !this.query.tiers.includes(tierSelection.objRef)
    ) {
      this.query.tiers.push(tierSelection.objRef);
      this.reloadFilters();
    }
  }

  removeTier(tier: RewardsTierLevel): void {
    this.query.tiers.splice(this.query.tiers.indexOf(tier), 1);
    this.reloadFilters();
  }

  typeSelected(typeSelection: SelectSearchItem<RewardsSettingType>): void {
    if (
      typeSelection.objRef &&
      !this.query.types.includes(typeSelection.objRef)
    ) {
      this.query.types.push(typeSelection.objRef);
      this.reloadFilters();
    }
  }

  removeType(settingType: RewardsSettingType): void {
    this.query.types.splice(this.query.types.indexOf(settingType), 1);
    this.reloadFilters();
  }

  envSelected(env: SelectSearchItem<CountryEnvironmentModel>): void {
    if (env.objRef) {
      this.selectedEnv = env.objRef;
      this.reloadFilters();
    }
  }

  private async reloadFilters(): Promise<void> {
    this.levels = new PageImpl(
      Object.keys(RewardsSettingLevel)
        .filter(
          (lvl) => !this.query.levels.includes(lvl as RewardsSettingLevel),
        )
        .map(
          (lvl) =>
            new SelectSearchItemImpl(lvl, lvl, lvl as RewardsSettingLevel),
        ),
    );

    this.tiers = new PageImpl(
      Object.keys(RewardsTierLevel)
        .filter((lvl) => !this.query.tiers.includes(lvl as RewardsTierLevel))
        .map(
          (lvl) => new SelectSearchItemImpl(lvl, lvl, lvl as RewardsTierLevel),
        ),
    );

    this.types = new PageImpl(
      Object.keys(RewardsSettingType)
        .filter((lvl) => !this.query.types.includes(lvl as RewardsSettingType))
        .map(
          (lvl) =>
            new SelectSearchItemImpl(lvl, lvl, lvl as RewardsSettingType),
        ),
    );

    const data = await this.rewardsSettingsService.searchSettings(this.query, this.selectedEnv);
    console.log(data.response);
  }
}

export const SEARCH_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SearchRewardsSettingsComponent,
  },
];
