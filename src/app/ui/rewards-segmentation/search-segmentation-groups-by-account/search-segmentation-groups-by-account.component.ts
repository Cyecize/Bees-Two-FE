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
import { SegmentationGroupModel } from '../../../api/rewards/segmentation/segmentation-group.model';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { ShowSegmentGroupDetailsDialogComponent } from '../show-segment-group-details-dialog/show-segment-group-details-dialog.component';
import { ShowSegmentGroupDetailsDialogPayload } from '../show-segment-group-details-dialog/show-segment-group-details-dialog.payload';
import { SegmentationGroupByAccountSearchResponse } from '../../../api/rewards/segmentation/segmentation-group-by-account.search-response';
import { EmptyPaginationV2 } from '../../../shared/util/page';
import {
  SegmentationGroupByAccountQuery,
  SegmentationGroupByAccountQueryImpl,
} from '../../../api/rewards/segmentation/segmentation-group-by-account.query';
import { SegmentationGroupByAccountModel } from '../../../api/rewards/segmentation/segmentation-group-by-account.model';
import { DealIdType } from '../../../api/deals/enums/deal-id-type';
import { ShowSegmentGroupByAccountDetailsDialogComponent } from '../show-segment-group-by-account-details-dialog/show-segment-group-by-account-details-dialog.component';
import { ShowSegmentGroupByAccountDetailsDialogPayload } from '../show-segment-group-by-account-details-dialog/show-segment-group-by-account-details-dialog.payload';

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
    await this.fetchData();
  }

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
    this.dialogService.open(
      ShowSegmentGroupByAccountDetailsDialogComponent,
      '',
      new ShowSegmentGroupByAccountDetailsDialogPayload(
        group,
        this.query,
        this.selectedEnv!,
      ),
    );
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
}

export const SEARCH_SEGMENTATION_GROUPS_BY_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: SearchSegmentationGroupsByAccountComponent,
  },
];
