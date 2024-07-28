import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { PlatformIdService } from '../../../../api/platformid/platform-id.service';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { SelectSearchComponent } from '../../../../shared/form-controls/select-search/select-search.component';
import { NgForOf, NgIf } from '@angular/common';
import { EmptyPage, Page, PageImpl } from '../../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../../shared/form-controls/select-search/select-search.item';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import {
  DealsSearchQuery,
  DealsSearchQueryImpl,
} from '../../../../api/deals/deals-search.query';
import { DealsService } from '../../../../api/deals/deals.service';
import {
  DealsSearchResponse,
  EmptyDealsSearchResponse,
} from '../../../../api/deals/deals-search.response';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { FormsModule } from '@angular/forms';
import { WrappedResponse } from '../../../../shared/util/field-error-wrapper';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { DealOutputType } from '../../../../api/deals/deal-output-type';
import { PromoType } from '../../../../api/promo/promo-type';
import { Deal } from '../../../../api/deals/deal';
import { ShowDealDetailsDialogComponent } from '../show-deal-details-dialog/show-deal-details-dialog.component';
import { ShowDealDetailsDialogPayload } from '../show-deal-details-dialog/show-deal-details-dialog.payload';

@Component({
  selector: 'app-search-deals',
  standalone: true,
  imports: [
    SelectSearchComponent,
    NgIf,
    CheckboxComponent,
    InputComponent,
    NgForOf,
    FormsModule,
    TooltipSpanComponent,
  ],
  templateUrl: './search-deals.component.html',
  styleUrl: './search-deals.component.scss',
})
export class SearchDealsComponent implements OnInit {
  environments: Page<SelectSearchItem<CountryEnvironmentModel>> =
    new EmptyPage();
  selectedEnv?: CountryEnvironmentModel;

  query: DealsSearchQuery = new DealsSearchQueryImpl();

  searchResponse: DealsSearchResponse = new EmptyDealsSearchResponse();
  fullResponse!: WrappedResponse<any>;

  outputTypes: Page<SelectSearchItem<DealOutputType>> = new EmptyPage();

  constructor(
    private platformIdService: PlatformIdService,
    private envService: CountryEnvironmentService,
    private dealsService: DealsService,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.selectedEnv = value;
        this.reloadFilters();
      }
    });

    this.environments = new PageImpl(
      (await this.envService.getEnvs()).map(
        (env) => new SelectSearchItemImpl(env.envName, env.id, env),
      ),
    );
  }

  envSelected(env: SelectSearchItem<CountryEnvironmentModel>): void {
    if (env.objRef) {
      this.selectedEnv = env.objRef;
      this.reloadFilters();
    }
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  async reloadFilters(): Promise<void> {
    this.query.body.vendorId = this.selectedEnv?.vendorId + '';

    this.outputTypes = new PageImpl(
      Object.keys(DealOutputType)
        .filter((lvl) => !this.query.types.includes(lvl as DealOutputType))
        .map(
          (lvl) => new SelectSearchItemImpl(lvl, lvl, lvl as DealOutputType),
        ),
    );

    this.query.page.page = 0;
    await this.fetchData();
    this.query.body.sanitize();
  }

  private async fetchData(): Promise<void> {
    const response = await this.dealsService.searchDeals(
      this.query,
      this.selectedEnv,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.searchResponse = beesResponse.response;
      } else {
        this.searchResponse = new EmptyDealsSearchResponse();
      }
    }
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  shortenStr(str: any): string {
    return (
      str.substring(0, Math.min(str.length, 25)) +
      (str.length > 25 ? '...' : '')
    );
  }

  openDetailsDialog(deal: Deal): void {
    this.dialogService.open(
      ShowDealDetailsDialogComponent,
      'Deal Details',
      new ShowDealDetailsDialogPayload(deal, this.selectedEnv),
    );
  }

  async contractIdChange(value: any): Promise<void> {
    this.query.body.contractId = undefined;

    if (value?.trim()) {
      const encodedPlatformId = await this.platformIdService.encodeContract({
        vendorId: this.envService.getCurrentEnv()?.vendorId || '',
        vendorAccountId: value,
      });

      this.query.body.contractId = encodedPlatformId.platformId;
    }

    this.reloadFilters();
  }

  addCouponCode(code: string): void {
    if (
      !ObjectUtils.isNil(code) &&
      !this.query.body.couponCode.includes(code)
    ) {
      this.query.body.couponCode.push(code);
      this.reloadFilters();
    }
  }

  removeCouponCode(code: string): void {
    this.query.body.couponCode.splice(
      this.query.body.couponCode.indexOf(code),
      1,
    );
    this.reloadFilters();
  }

  addItemId(itemId: string): void {
    if (
      !ObjectUtils.isNil(itemId) &&
      !this.query.body.itemIds.includes(itemId)
    ) {
      this.query.body.itemIds.push(itemId);
      this.reloadFilters();
    }
  }

  removeItemId(itemId: string): void {
    this.query.body.itemIds.splice(this.query.body.itemIds.indexOf(itemId), 1);
    this.reloadFilters();
  }

  addPromoId(promoId: string): void {
    if (
      !ObjectUtils.isNil(promoId) &&
      !this.query.body.vendorPromotionIds.includes(promoId)
    ) {
      this.query.body.vendorPromotionIds.push(promoId);
      this.reloadFilters();
    }
  }

  removePromoId(promoId: string): void {
    this.query.body.vendorPromotionIds.splice(
      this.query.body.vendorPromotionIds.indexOf(promoId),
      1,
    );
    this.reloadFilters();
  }

  outputTypeSelected(typeSelection: SelectSearchItem<DealOutputType>): void {
    if (
      typeSelection.objRef &&
      !this.query.types.includes(typeSelection.objRef)
    ) {
      this.query.types.push(typeSelection.objRef);
      this.reloadFilters();
    }
  }

  removeOutputType(outputType: DealOutputType): void {
    this.query.types.splice(this.query.types.indexOf(outputType), 1);
    this.reloadFilters();
  }
}

export const SEARCH_DEALS_ROUTES: Routes = [
  {
    path: '',
    component: SearchDealsComponent,
  },
];
