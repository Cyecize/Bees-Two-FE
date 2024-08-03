import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { FormsModule } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
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
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      if (!ObjectUtils.isNil(this.envOverride)) {
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

  async reloadFilters(): Promise<void> {
    this.query.vendorId = this.envOverride?.vendorId + '';

    if (this.query.ids.length > 0 || this.query.itemPlatformIds.length > 0) {
      // If this is not cleared, searching by ID and platform ID will not work!
      this.query.vendorId = '';
    }

    this.query.page.page = 0;

    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
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
    }
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  openDetailsDialog(item: Item): void {
    console.log(item);
    // this.dialogService.open(
    //   ShowAccountDetailsDialogComponent,
    //   '',
    //   new ShowAccountDetailsDialogPayload(account, this.envOverride),
    // );
  }

  addSKU(code: string): void {
    if (!ObjectUtils.isNil(code) && !this.query.skus.includes(code)) {
      this.query.skus.push(code);
      this.reloadFilters();
    }
  }

  removeSKU(code: string): void {
    this.query.skus.splice(this.query.skus.indexOf(code), 1);
    this.reloadFilters();
  }

  addVendorItemId(id: string): void {
    if (!ObjectUtils.isNil(id) && !this.query.vendorItemIds.includes(id)) {
      this.query.vendorItemIds.push(id);
      this.reloadFilters();
    }
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
}

export const SEARCH_ITEMS_ROUTES: Routes = [
  {
    path: '',
    component: SearchItemsComponent,
  },
];
