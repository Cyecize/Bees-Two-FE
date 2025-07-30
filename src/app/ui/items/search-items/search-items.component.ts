import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { FormsModule } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import {
  ItemSearchQueryImpl,
  ItemsSearchQuery,
} from '../../../api/items/items-search.query';
import { Item } from '../../../api/items/item';
import { ItemsSearchResponse } from '../../../api/items/items-search.response';
import { ItemService } from '../../../api/items/item.service';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { ShowItemDetailsDialogComponent } from '../show-item-details-dialog/show-item-details-dialog.component';
import { ShowItemDetailsDialogPayload } from '../show-item-details-dialog/show-item-details-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { ItemsPriceFetchDataCollectDialogResponse } from '../items-price-fetch-data-collect-dialog/items-price-fetch-data-collect-dialog.response';
import { ItemsPriceFetchDataCollectDialog } from '../items-price-fetch-data-collect-dialog/items-price-fetch-data-collect-dialog.component';
import { ItemsPriceFetchDataCollectionDialogPayload } from '../items-price-fetch-data-collect-dialog/items-price-fetch-data-collection-dialog.payload';
import {
  SingleItemPriceV3Query,
  SingleItemPriceV3QueryImpl,
} from '../../../api/price/single-item-price-v3.query';
import { PriceService } from '../../../api/price/price.service';
import { SingleItemPriceV3 } from '../../../api/price/single-item-price-v3';
import { ArrayUtils } from '../../../shared/util/array-utils';

@Component({
  selector: 'app-search-items',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
    FormsModule,
    CheckboxComponent,
  ],
  templateUrl: './search-items.component.html',
  styleUrl: './search-items.component.scss',
})
export class SearchItemsComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: ItemsSearchQuery = new ItemSearchQueryImpl();

  items: Item[] = [];
  fullResponse!: WrappedResponse<ItemsSearchResponse>;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private itemService: ItemService,
    private priceService: PriceService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (!ObjectUtils.isNil(value)) {
        this.envOverride = value;

        this.reloadFilters();
      }
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  @ShowLoader()
  async fetchAllPages(): Promise<void> {
    const res = await this.doFetchAllPages();
    alert('Printing JSON in the console!');
    console.log(JSON.stringify(res));
  }

  private async doFetchAllPages(): Promise<Item[]> {
    const oldSize = this.query.page.pageSize;

    try {
      this.query.page.pageSize = 200;
      const res: Item[] = [];
      let page = -1;
      let hasNext = true;

      while (hasNext) {
        page++;
        this.query.page.page = page;
        console.log(`fetching page ${page}`);

        if (!(await this.fetchData())) {
          alert('Could not load all pages, stopping on page ' + (page + 1));
          return [];
        }

        res.push(...this.items);
        hasNext = this.fullResponse.response?.response?.pagination?.hasNext;
      }

      return res;
    } finally {
      this.query.page.pageSize = oldSize;
    }
  }

  async reloadFilters(): Promise<void> {
    this.query.vendorId = this.envOverride?.vendorId + '';
    if (this.query.ids.length > 0 || this.query.itemPlatformIds.length > 0) {
      // If this is not cleared, searching by ID and platform ID will not work!
      this.query.vendorId = '';
    }

    this.query.page.page = 0;

    await this.fetchData();
  }

  private async fetchData(): Promise<boolean> {
    const response = await this.itemService.searchItems(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.items = beesResponse.response.items;
      } else {
        this.items = [];
      }

      return true;
    }

    return false;
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  openDetailsDialog(item: Item): void {
    this.dialogService.open(
      ShowItemDetailsDialogComponent,
      '',
      new ShowItemDetailsDialogPayload(item, this.envOverride),
    );
  }

  addSKU(code: string): void {
    if (!ObjectUtils.isNil(code)) {
      let added = false;
      for (const sku of code.split(/,\s*/)) {
        if (this.doAddSku(sku)) {
          added = true;
        }
      }

      if (added) {
        this.reloadFilters();
      }
    }
  }

  private doAddSku(code: string): boolean {
    code = code.trim();
    if (!this.query.skus.includes(code)) {
      this.query.skus.push(code);
      return true;
    }

    return false;
  }

  removeSKU(code: string): void {
    this.query.skus.splice(this.query.skus.indexOf(code), 1);
    this.reloadFilters();
  }

  addVendorItemId(code: string): void {
    if (!ObjectUtils.isNil(code)) {
      let added = false;
      for (const id of code.split(/,\s*/)) {
        if (this.doAddVendorItemId(id)) {
          added = true;
        }
      }

      if (added) {
        this.reloadFilters();
      }
    }
  }

  private doAddVendorItemId(id: string): boolean {
    id = id.trim();
    if (!this.query.vendorItemIds.includes(id)) {
      this.query.vendorItemIds.push(id);
      return true;
    }

    return false;
  }

  removeVendorItemId(id: string): void {
    this.query.vendorItemIds.splice(this.query.vendorItemIds.indexOf(id), 1);
    this.reloadFilters();
  }

  addBeesId(id: string): void {
    if (!ObjectUtils.isNil(id) && !this.query.ids.includes(id)) {
      this.query.ids.push(id);
      this.reloadFilters();
    }
  }

  removeBeesId(id: string): void {
    this.query.ids.splice(this.query.ids.indexOf(id), 1);
    this.reloadFilters();
  }

  addPlatformId(id: string): void {
    if (!ObjectUtils.isNil(id) && !this.query.itemPlatformIds.includes(id)) {
      this.query.itemPlatformIds.push(id);
      this.reloadFilters();
    }
  }

  removePlatformId(id: string): void {
    this.query.itemPlatformIds.splice(
      this.query.itemPlatformIds.indexOf(id),
      1,
    );
    this.reloadFilters();
  }

  addAgingGroup(group: string): void {
    if (!ObjectUtils.isNil(group) && !this.query.agingGroups.includes(group)) {
      this.query.agingGroups.push(group);
      this.reloadFilters();
    }
  }

  removeAgingGroup(group: string): void {
    this.query.agingGroups.splice(this.query.agingGroups.indexOf(group), 1);
    this.reloadFilters();
  }

  async fetchPrices(): Promise<void> {
    const data: ItemsPriceFetchDataCollectDialogResponse | undefined =
      await firstValueFrom(
        this.dialogService
          .open(
            ItemsPriceFetchDataCollectDialog,
            '',
            new ItemsPriceFetchDataCollectionDialogPayload(this.envOverride!),
          )
          .afterClosed(),
      );

    if (!data) {
      return;
    }

    await this.doFetchPrices(data);
  }

  @ShowLoader()
  private async doFetchPrices(
    data: ItemsPriceFetchDataCollectDialogResponse,
  ): Promise<void> {
    const allItems = await this.doFetchAllPages();

    if (!allItems.length) {
      alert('There are no items!');
      return;
    }

    const pricesResp = await this.priceService.fetchAllPrices(
      allItems,
      data.contractId,
      data.priceListId,
      this.envOverride,
    );

    if (!pricesResp.hasErrors) {
      const allPrices = pricesResp.prices;
      this.dialogService.openShowCodeDialog(
        JSON.stringify(allPrices, null, 2),
        `Available prices (${allPrices.length})`,
      );
    }
  }
}

export const SEARCH_ITEMS_ROUTES: Routes = [
  {
    path: '',
    component: SearchItemsComponent,
  },
];
