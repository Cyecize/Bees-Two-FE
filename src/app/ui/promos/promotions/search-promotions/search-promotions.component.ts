import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { SelectSearchComponent } from '../../../../shared/form-controls/select-search/select-search.component';
import {
  EmptyHasNextPagination,
  EmptyPage,
  Page,
  PageImpl,
} from '../../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../../shared/form-controls/select-search/select-search.item';
import { PromoService } from '../../../../api/promo/promo.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import {
  PromoSearchQuery,
  PromoSearchQueryImpl,
} from '../../../../api/promo/promo-search.query';
import { PromoType } from '../../../../api/promo/promo-type';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { PromoSearchResponse } from '../../../../api/promo/promo-search.response';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { Promo } from '../../../../api/promo/promo';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ShowPromoDetailsDialogComponent } from '../show-promo-details-dialog/show-promo-details-dialog.component';
import { ShowPromoDetailsDialogPayload } from '../show-promo-details-dialog/show-promo-details-dialog.payload';
import { PlatformIdService } from '../../../../api/platformid/platform-id.service';

@Component({
  selector: 'app-search-promotions',
  standalone: true,
  imports: [
    NgForOf,
    SelectSearchComponent,
    InputComponent,
    FormsModule,
    CheckboxComponent,
    NgIf,
    TooltipSpanComponent,
    EnvOverrideFieldComponent,
  ],
  templateUrl: './search-promotions.component.html',
  styleUrl: './search-promotions.component.scss',
})
export class SearchPromotionsComponent implements OnInit, OnDestroy {
  types: Page<SelectSearchItem<PromoType>> = new EmptyPage();

  selectedEnv?: CountryEnvironmentModel;
  envSub!: Subscription;

  query: PromoSearchQuery = new PromoSearchQueryImpl();
  searchResponse: PromoSearchResponse = {
    promotions: [],
    pagination: new EmptyHasNextPagination(),
  };

  constructor(
    private envOverrideService: EnvOverrideService,
    private promoService: PromoService,
    private dialogService: DialogService,
    private platformIdService: PlatformIdService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.selectedEnv = value;
      this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  typeSelected(typeSelection: SelectSearchItem<PromoType>): void {
    if (
      typeSelection.objRef &&
      !this.query.types.includes(typeSelection.objRef)
    ) {
      this.query.types.push(typeSelection.objRef);
      this.reloadFilters();
    }
  }

  removeType(settingType: PromoType): void {
    this.query.types.splice(this.query.types.indexOf(settingType), 1);
    this.reloadFilters();
  }

  private async reloadFilters(): Promise<void> {
    this.query.vendorIds = [this.selectedEnv?.vendorId + ''];

    this.types = new PageImpl(
      Object.keys(PromoType)
        .filter((lvl) => !this.query.types.includes(lvl as PromoType))
        .map((lvl) => new SelectSearchItemImpl(lvl, lvl, lvl as PromoType)),
    );

    this.query.page.page = 0;
    await this.fetchData();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  queryStringChange(str?: string): void {
    this.query.query = str;
    this.reloadFilters();
  }

  ignoreStartDateToggleChange(value?: boolean): void {
    this.query.ignoreStartDate = value;
    this.reloadFilters();
  }

  private async fetchData(): Promise<void> {
    const response = await this.promoService.searchPromos(
      this.query,
      this.selectedEnv,
    );

    if (response.response) {
      this.searchResponse = response.response;
    } else {
      this.searchResponse = {
        promotions: [],
        pagination: new EmptyHasNextPagination(),
      };
    }
  }

  shortenStr(str: any): string {
    return (
      str.substring(0, Math.min(str.length, 25)) +
      (str.length > 25 ? '...' : '')
    );
  }

  openDetailsDialog(promo: Promo): void {
    this.dialogService
      .open(
        ShowPromoDetailsDialogComponent,
        `Promo: ${promo.title}`,
        new ShowPromoDetailsDialogPayload(promo, this.selectedEnv!),
      )
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.pageChange(0);
        }
      });
  }

  async generatePromoPlatformId(val: string): Promise<void> {
    if (!val?.trim()) {
      return;
    }

    const platformId = await this.platformIdService.encodePromotionId({
      vendorId: this.selectedEnv!.vendorId!,
      vendorPromotionId: val,
    });

    this.query.promotionPlatformIds.push(platformId.platformId);
    this.reloadFilters();
  }

  removePromoId(ind: number): void {
    this.query.promotionPlatformIds.splice(ind, 1);
    this.reloadFilters();
  }
}

export const SEARCH_PROMOTIONS_ROUTES: Routes = [
  {
    path: '',
    component: SearchPromotionsComponent,
  },
];
