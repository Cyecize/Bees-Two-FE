import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import {
  EmptyPage,
  EmptyPagination,
  Page,
  PageImpl,
} from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import {
  RewardsSettingsSearchQuery,
  RewardsSettingsSearchQueryImpl,
} from '../../../api/rewards/settings/rewards-settings-search.query';
import { RewardsSettingLevel } from '../../../api/rewards/settings/enums/rewards-setting-level';
import { NgForOf, NgIf } from '@angular/common';
import { RewardsTierLevel } from '../../../api/rewards/rewards-tier-level';
import { RewardsSettingType } from '../../../api/rewards/settings/enums/rewards-setting-type';
import { RewardsSettingsService } from '../../../api/rewards/settings/rewards-settings.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import {
  RewardSetting,
  RewardsSettingsSearchResponse,
} from '../../../api/rewards/settings/rewards-settings-search.response';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { ShowRewardSettingDialogComponent } from '../show-reward-setting-dialog/show-reward-setting-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ShowRewardSettingDialogPayload } from '../show-reward-setting-dialog/show-reward-setting-dialog.payload';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { Subscription } from 'rxjs';
import { OverrideAuthTokenFieldComponent } from '../../env/token/override-auth-token-field/override-auth-token-field.component';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { BeesTokenOverrideService } from '../../../api/env/token/bees-token-override.service';
import { BeesTokenImpl } from '../../../api/env/token/bees-token';

@Component({
  selector: 'app-search-rewards',
  standalone: true,
  imports: [
    SelectSearchComponent,
    InputComponent,
    NgForOf,
    TooltipSpanComponent,
    RouterLink,
    PaginationComponent,
    EnvOverrideFieldComponent,
    OverrideAuthTokenFieldComponent,
    NgIf,
  ],
  templateUrl: './search-rewards-settings.component.html',
  styleUrl: './search-rewards-settings.component.scss',
})
export class SearchRewardsSettingsComponent implements OnInit, OnDestroy {
  levels: Page<SelectSearchItem<RewardsSettingLevel>> = new EmptyPage();
  tiers: Page<SelectSearchItem<RewardsTierLevel>> = new EmptyPage();
  types: Page<SelectSearchItem<RewardsSettingType>> = new EmptyPage();

  query: RewardsSettingsSearchQuery = new RewardsSettingsSearchQueryImpl();

  searchResponse: RewardsSettingsSearchResponse = {
    content: [],
    pagination: new EmptyPagination(),
  };

  selectedEnv?: CountryEnvironmentModel;
  envSub!: Subscription;

  fullResponse: WrappedResponse<any> | null = null;

  constructor(
    private rewardsSettingsService: RewardsSettingsService,
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
    private tokenOverrideService: BeesTokenOverrideService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe(
      async (value) => {
        if (value) {
          this.selectedEnv = value;
          void this.reloadFilters();
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  levelSelected(levelSelection: SelectSearchItem<RewardsSettingLevel>): void {
    if (
      levelSelection.objRef &&
      !this.query.levels.includes(levelSelection.objRef)
    ) {
      this.query.levels.push(levelSelection.objRef);
      void this.reloadFilters();
    }
  }

  removeLevel(level: RewardsSettingLevel): void {
    this.query.levels.splice(this.query.levels.indexOf(level), 1);
    void this.reloadFilters();
  }

  tierSelected(tierSelection: SelectSearchItem<RewardsTierLevel>): void {
    if (
      tierSelection.objRef &&
      !this.query.tiers.includes(tierSelection.objRef)
    ) {
      this.query.tiers.push(tierSelection.objRef);
      void this.reloadFilters();
    }
  }

  removeTier(tier: RewardsTierLevel): void {
    this.query.tiers.splice(this.query.tiers.indexOf(tier), 1);
    void this.reloadFilters();
  }

  typeSelected(typeSelection: SelectSearchItem<RewardsSettingType>): void {
    if (
      typeSelection.objRef &&
      !this.query.types.includes(typeSelection.objRef)
    ) {
      this.query.types.push(typeSelection.objRef);
      void this.reloadFilters();
    }
  }

  removeType(settingType: RewardsSettingType): void {
    this.query.types.splice(this.query.types.indexOf(settingType), 1);
    void this.reloadFilters();
  }

  shortenStr(str: string): string {
    return str.substring(0, Math.min(str.length, 15));
  }

  openDetailsDialog(setting: RewardSetting): void {
    this.dialogService.open(
      ShowRewardSettingDialogComponent,
      'Details',
      new ShowRewardSettingDialogPayload(setting, this.selectedEnv),
    );
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

    this.query.page.page = 0;
    await this.fetchData();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse!);
  }

  async onTokenChange(val: string): Promise<void> {
    if (!val) {
      return;
    }

    this.tokenOverrideService.addToken(
      new BeesTokenImpl(
        val,
        new Date(new Date().getTime() + 50 * 60000),
        this.selectedEnv!.id!,
      ),
    );
    await this.reloadFilters();
  }

  private async fetchData(): Promise<void> {
    this.fullResponse = null;
    const beesToken = this.tokenOverrideService.getBeesToken(this.selectedEnv!);
    let token = undefined;
    if (beesToken) {
      token = beesToken.token;
    }

    const response = await this.rewardsSettingsService.searchSettings(
      this.query,
      this.selectedEnv,
      token,
    );

    this.fullResponse = response;

    if (response.response) {
      this.searchResponse = response.response.response;
    } else {
      this.searchResponse = { content: [], pagination: new EmptyPagination() };
    }
  }
}

export const SEARCH_REWARDS_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SearchRewardsSettingsComponent,
  },
];
