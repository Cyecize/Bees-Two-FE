import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { pageToPagination } from '../../../shared/util/page';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { ItemsPickerDialogPayload } from './items-picker-dialog.payload';
import {
  ItemSearchQueryImpl,
  ItemsSearchQuery,
} from '../../../api/items/items-search.query';
import { Item } from '../../../api/items/item';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { ItemsSearchResponse } from '../../../api/items/items-search.response';
import { ItemService } from '../../../api/items/item.service';
import { ObjectUtils } from '../../../shared/util/object-utils';

@Component({
  selector: 'app-items-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PaginationComponent,
    InputComponent,
    TooltipSpanComponent,
  ],
  templateUrl: './items-picker-dialog.component.html',
  styleUrl: './items-picker-dialog.component.scss',
})
export class ItemsPickerDialogComponent
  extends DialogContentBaseComponent<ItemsPickerDialogPayload>
  implements OnInit
{
  private readonly PAGE_SIZE = 5;
  query: ItemsSearchQuery = new ItemSearchQueryImpl();

  items: Item[] = [];
  fullResponse!: WrappedResponse<ItemsSearchResponse>;

  constructor(
    private itemService: ItemService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Pick an Item');
    this.query.page.pageSize = this.PAGE_SIZE;
    if (this.payload.vendorItemId) {
      this.query.vendorItemIds.push(this.payload.vendorItemId);
    }
    this.reloadFilters();
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  selectItem(item: Item): void {
    this.close(item);
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

  pageChanged(page: number): void {
    this.query.page.page = page;
    this.fetch();
  }

  reloadFilters(): void {
    this.query.page.page = 0;

    this.query.vendorId = this.payload.env.vendorId + '';

    if (this.query.ids.length > 0 || this.query.itemPlatformIds.length > 0) {
      // If this is not cleared, searching by ID and platform ID will not work!
      this.query.vendorId = '';
    }

    this.fetch();
  }

  private async fetch(): Promise<void> {
    this.fullResponse = await this.itemService.searchItems(
      this.query,
      this.payload.env,
    );

    if (this.fullResponse.isSuccess) {
      this.items = this.fullResponse.response.response.items;
    }
  }
}
