import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import {
  ChallengesQuery,
  ChallengesQueryImpl,
} from '../../../api/rewards/challenges/challenges-query';
import { ChallengeExecutionMethod } from '../../../api/rewards/challenges/challenge-execution-method';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import {
  EmptyPage,
  EmptyPagination,
  Page,
  PageImpl,
} from '../../../shared/util/page';
import { ChallengeMode } from '../../../api/rewards/challenges/challenge-mode';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
  SelectOptionKvp,
} from '../../../shared/form-controls/select/select.option';
import { ChallengeSort } from '../../../api/rewards/challenges/challenge.sort';
import { SortDirection } from '../../../shared/util/sort.query';
import { ChallengeFilterType } from '../../../api/rewards/challenges/challenge-filter-type';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { ChallengeService } from '../../../api/rewards/challenges/challenge.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { Subscription } from 'rxjs';
import { ChallengesSearchResponse } from '../../../api/rewards/challenges/challenges-search.response';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { Challenge } from '../../../api/rewards/challenges/challenge';
import { ShowChallengeDialogComponent } from '../show-challenge-dialog/show-challenge-dialog.component';
import { ShowChallengeDialogPayload } from '../show-challenge-dialog/show-challenge-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-search-challenges',
  standalone: true,
  imports: [
    CheckboxComponent,
    EnvOverrideFieldComponent,
    InputComponent,
    NgForOf,
    SelectSearchComponent,
    SelectComponent,
    FormsModule,
    NgIf,
    PaginationComponent,
    MatDatepicker,
    MatDatepickerInput,
    TooltipSpanComponent,
  ],
  templateUrl: './search-challenges.component.html',
  styleUrl: './search-challenges.component.scss',
})
export class SearchChallengesComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: ChallengesQuery = new ChallengesQueryImpl();
  executionMethods: Page<SelectSearchItem<ChallengeExecutionMethod>> =
    new EmptyPage();
  challengeModes: Page<SelectSearchItem<ChallengeMode>> = new EmptyPage();
  sortOptions: SelectOption[] = [];
  sortDirections: SelectOption[] = [];
  filterTypes: SelectOption[] = [];

  fullResponse!: WrappedResponse<any>;
  challenges: ChallengesSearchResponse = {
    content: [],
    pagination: new EmptyPagination(),
  };

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private challengeService: ChallengeService,
  ) {}

  ngOnInit(): void {
    this.sortOptions = [new SelectOptionKvp('Any', null)].concat(
      ...Object.keys(ChallengeSort).map((val) => new SelectOptionKey(val)),
    );

    this.sortDirections = [new SelectOptionKvp('Any', null)].concat(
      ...Object.keys(SortDirection).map((val) => new SelectOptionKey(val)),
    );

    this.filterTypes = [new SelectOptionKvp('Any', null)].concat(
      ...Object.keys(ChallengeFilterType).map(
        (val) => new SelectOptionKey(val),
      ),
    );

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  async reloadFilters(): Promise<void> {
    this.query.page.page = 0;

    this.executionMethods = new PageImpl(
      Object.keys(ChallengeExecutionMethod)
        .filter(
          (lvl) =>
            !this.query.executionMethod.includes(
              lvl as ChallengeExecutionMethod,
            ),
        )
        .map(
          (lvl) =>
            new SelectSearchItemImpl(lvl, lvl, lvl as ChallengeExecutionMethod),
        ),
    );

    this.challengeModes = new PageImpl(
      Object.keys(ChallengeMode)
        .filter((lvl) => !this.query.modes.includes(lvl as ChallengeMode))
        .map((lvl) => new SelectSearchItemImpl(lvl, lvl, lvl as ChallengeMode)),
    );

    await this.fetchData();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  @ShowLoader()
  private async fetchData(): Promise<void> {
    const response = await this.challengeService.searchChallenges(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.challenges = beesResponse.response;
      } else {
        this.challenges = {
          pagination: new EmptyPagination(),
          content: [],
        };
      }
    }
  }

  executionMethodSelected(
    method: SelectSearchItem<ChallengeExecutionMethod>,
  ): void {
    if (method.objRef && !this.query.executionMethod.includes(method.objRef)) {
      this.query.executionMethod.push(method.objRef);
      this.reloadFilters();
    }
  }

  removeExecutionMethod(method: ChallengeExecutionMethod): void {
    this.query.executionMethod.splice(
      this.query.executionMethod.indexOf(method),
      1,
    );
    this.reloadFilters();
  }

  addChallengeId(chId: any): void {
    chId = chId?.trim();
    if (this.query.challengeIds.includes(chId)) {
      return;
    }
    this.query.challengeIds.push(chId);
    this.reloadFilters();
  }

  removeChallengeId(ind: number): void {
    this.query.challengeIds.splice(ind, 1);
    this.reloadFilters();
  }

  challengeModeSelected(mode: SelectSearchItem<any>): void {
    if (mode.objRef && !this.query.modes.includes(mode.objRef)) {
      this.query.modes.push(mode.objRef);
      this.reloadFilters();
    }
  }

  removeChallengeMode(ind: number): void {
    this.query.modes.splice(ind, 1);
    this.reloadFilters();
  }

  addVendorId(val: string): void {
    val = val?.trim();
    if (this.query.vendorIds.includes(val)) {
      return;
    }
    this.query.vendorIds.push(val);
    this.reloadFilters();
  }

  removeVendorId(ind: number): void {
    this.query.vendorIds.splice(ind, 1);
    this.reloadFilters();
  }

  sortOptionChange(val: any): void {
    this.query.challengeSort = val;
    this.reloadFilters();
  }

  sortDirectionChange(val: any): void {
    this.query.sortingOrder = val;
    this.reloadFilters();
  }

  onRegexSearch(val: any): void {
    this.query.regexFilter = val?.trim() || undefined;
    this.reloadFilters();
  }

  filterTypeChange(val: any): void {
    this.query.filterType = val;
    this.reloadFilters();
  }

  addGroupId(val: any): void {
    val = val?.trim();
    if (this.query.groupIds.includes(val)) {
      return;
    }
    this.query.groupIds.push(val);
    this.reloadFilters();
  }

  removeGroupId(ind: number): void {
    this.query.groupIds.splice(ind, 1);
    this.reloadFilters();
  }

  startDateChange(date: any): void {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
    );

    this.query.startDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    this.reloadFilters();
  }

  endDateChange(date: any): void {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
    );

    this.query.endDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    this.reloadFilters();
  }

  openDetailsDialog(challenge: Challenge): void {
    this.dialogService
      .open(
        ShowChallengeDialogComponent,
        'Challenge Details',
        new ShowChallengeDialogPayload(challenge, this.envOverride!),
      )
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.reloadFilters();
        }
      });
  }
}

export const SEARCH_CHALLENGES_ROUTES: Routes = [
  {
    path: '',
    component: SearchChallengesComponent,
  },
];
