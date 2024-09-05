import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf } from '@angular/common';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { Subscription } from 'rxjs';
import {
  SegmentationGroupQuery,
  SegmentationGroupQueryImpl,
} from '../../../api/rewards/segmentation/segmentation-group.query';
import { SegmentationGroupModel } from '../../../api/rewards/segmentation/segmentation-group.model';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { ShowSegmentGroupDetailsDialogComponent } from '../show-segment-group-details-dialog/show-segment-group-details-dialog.component';
import { ShowSegmentGroupDetailsDialogPayload } from '../show-segment-group-details-dialog/show-segment-group-details-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-search-segmentation-groups',
  standalone: true,
  imports: [
    SelectSearchComponent,
    InputComponent,
    NgForOf,
    TooltipSpanComponent,
    RouterLink,
    PaginationComponent,
    EnvOverrideFieldComponent,
  ],
  templateUrl: './search-segmentation-groups.component.html',
  styleUrl: './search-segmentation-groups.component.scss',
})
export class SearchSegmentationGroupsComponent implements OnInit, OnDestroy {
  query: SegmentationGroupQuery = new SegmentationGroupQueryImpl();

  searchResponse: SegmentationGroupModel[] = [];

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

  @ShowLoader()
  private async fetchData(): Promise<void> {
    const response = await this.segmentationService.searchGroups(
      this.query,
      this.selectedEnv,
    );

    if (response.response) {
      this.searchResponse = response.response;
    } else {
      this.searchResponse = [];
    }
  }

  openDetailsDialog(group: SegmentationGroupModel): void {
    this.dialogService
      .open(
        ShowSegmentGroupDetailsDialogComponent,
        '',
        new ShowSegmentGroupDetailsDialogPayload(
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
}

export const SEARCH_SEGMENTATION_GROUPS_ROUTES: Routes = [
  {
    path: '',
    component: SearchSegmentationGroupsComponent,
  },
];
