import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { Subscription } from 'rxjs';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { SegmentationGroupByAccountSearchResponse } from '../../../api/rewards/segmentation/segmentation-group-by-account.search-response';
import { EmptyPaginationV2, v2ToV1Pagination } from '../../../shared/util/page';
import {
  SegmentationGroupByAccountQuery,
  SegmentationGroupByAccountQueryImpl,
} from '../../../api/rewards/segmentation/segmentation-group-by-account.query';
import { SegmentationGroupByAccountModel } from '../../../api/rewards/segmentation/segmentation-group-by-account.model';
import { DealIdType } from '../../../api/deals/enums/deal-id-type';
import { ShowSegmentGroupByAccountDetailsDialogComponent } from '../show-segment-group-by-account-details-dialog/show-segment-group-by-account-details-dialog.component';
import { ShowSegmentGroupByAccountDetailsDialogPayload } from '../show-segment-group-by-account-details-dialog/show-segment-group-by-account-details-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-search-segmentation-groups-by-account',
  standalone: true,
  imports: [
    SelectSearchComponent,
    InputComponent,
    NgForOf,
    TooltipSpanComponent,
    RouterLink,
    PaginationComponent,
    EnvOverrideFieldComponent,
    NgIf,
  ],
  templateUrl: './search-segmentation-groups-by-account.component.html',
  styleUrl: './search-segmentation-groups-by-account.component.scss',
})
export class SearchSegmentationGroupsByAccountComponent
  implements OnInit, OnDestroy
{
  query: SegmentationGroupByAccountQuery =
    new SegmentationGroupByAccountQueryImpl();

  searchResponse: SegmentationGroupByAccountSearchResponse = {
    content: [],
    pagination: new EmptyPaginationV2(),
  };

  selectedEnv?: CountryEnvironmentModel;
  envSub!: Subscription;

  constructor(
    private segmentationService: SegmentationService,
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.selectedEnv = value;
      this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  shortenStr(str: string): string {
    return str.substring(0, Math.min(str.length, 15));
  }

  async reloadFilters(): Promise<void> {
    this.query.page.page = 0;
    await this.fetchData();
  }

  @ShowLoader()
  private async fetchData(): Promise<void> {
    const response = await this.segmentationService.searchGroupsByAccount(
      this.query,
      this.selectedEnv,
    );

    if (response.response) {
      this.searchResponse = response.response;
    } else {
      this.searchResponse = {
        content: [],
        pagination: new EmptyPaginationV2(),
      };
    }
  }

  openDetailsDialog(group: SegmentationGroupByAccountModel): void {
    this.dialogService
      .open(
        ShowSegmentGroupByAccountDetailsDialogComponent,
        '',
        new ShowSegmentGroupByAccountDetailsDialogPayload(
          group,
          this.query,
          this.selectedEnv!,
        ),
      )
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.reloadFilters();
        }
      });
  }

  protected readonly DealIdType = DealIdType;

  pickAccount(): void {
    if (!this.selectedEnv) {
      alert('Please choose an environment first!');
      return;
    }
    this.dialogService
      .openAccountPicker(this.selectedEnv)
      .subscribe(async (account) => {
        if (account) {
          this.addAccountId(account.beesId);
        }
      });
  }

  addAccountId(accId: string): void {
    this.query.accountIds.push(accId);
    this.reloadFilters();
  }

  protected readonly v2ToV1Pagination = v2ToV1Pagination;

  pageChange(page: number): void {
    this.query.page.page = page;
    this.fetchData();
  }
}

export const SEARCH_SEGMENTATION_GROUPS_BY_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: SearchSegmentationGroupsByAccountComponent,
  },
];
