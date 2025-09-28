import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { firstValueFrom, Subscription } from 'rxjs';

import {
  InventoryV1Query,
  InventoryV1QueryImpl,
} from '../../../api/inventory/dto/inventory-v1.query';
import { InventoryItemResponse } from '../../../api/inventory/dto/inventory-item-response';
import { InventoryService } from '../../../api/inventory/inventory.service';
import { AccountV1Service } from '../../../api/accounts/v1/account-v1.service';
import { LocalAccount } from '../../../api/accounts/local/local-account';
import { FlattenedInventory } from '../../../api/inventory/dto/flattened-inventory';

@Component({
  selector: 'app-search-inventory',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    FormsModule,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
  ],
  templateUrl: './search-inventory.component.html',
  styleUrl: './search-inventory.component.scss',
})
export class SearchInventoryComponent implements OnInit, OnDestroy {
  protected envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: InventoryV1Query = new InventoryV1QueryImpl();

  inventories: FlattenedInventory[] = [];
  ddcs: string[] = [];
  fullResponse!: WrappedResponse<InventoryItemResponse[]>;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private inventoryService: InventoryService,
    private accountService: AccountV1Service,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      void this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  openDetailsDialog(inv: FlattenedInventory): void {
    void this.dialogService.openInventoryDetails(inv, this.envOverride);
  }

  async reloadFilters(): Promise<void> {
    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    const response = await this.inventoryService.searchStockV1(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    this.inventories = [];
    this.ddcs = [];

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.inventories = beesResponse.response.flatMap((inv) => {
          return inv.inventories.map((i) => {
            return {
              ddc: inv.deliveryCenterId,
              vendorId: inv.vendorId,
              quantity: i.quantity,
              vendorItemId: i.vendorItemId,
            };
          });
        });

        this.ddcs = beesResponse.response.map((inv) => inv.deliveryCenterId);
      }
    }
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  addDDC(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.deliveryCenters.push(val);
    void this.reloadFilters();
  }

  removeDDC(ind: number): void {
    this.query.deliveryCenters.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickDDCFromAccount(): Promise<void> {
    const acc = await this.pickBeesAccount();
    if (acc && acc.deliveryCenterId) {
      this.addDDC(acc.deliveryCenterId);
    }
  }

  addCurrentVendorId(): void {
    this.query.vendorId = this.envOverride!.vendorId;
    void this.reloadFilters();
  }

  async pickVendorIdFromEnv(): Promise<void> {
    const envs = await this.dialogService.openEnvPickerMultiselect();
    if (envs.length > 0) {
      this.query.vendorId = envs[0].vendorId;
    } else {
      this.query.vendorId = null;
    }

    void this.reloadFilters();
  }

  async pickVendorAccountIdFromAccount(): Promise<void> {
    const acc = await this.pickLocalAccount();
    if (acc) {
      this.query.vendorAccountId = acc.vendorAccountId;
      void this.reloadFilters();
    }
  }

  removeVendorItemId(ind: number): void {
    this.query.vendorItemIds.splice(ind, 1);
    void this.reloadFilters();
  }

  addVendorItemId(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.vendorItemIds.push(val);
    void this.reloadFilters();
  }

  showRawResponse(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(this.fullResponse.response.response, null, 2),
      'Raw response',
    );
  }

  showAllInventories(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(this.inventories, null, 2),
      `${this.inventories.length} Inventories`,
    );
  }

  showAllDDCs(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(this.ddcs, null, 2),
      `${this.ddcs.length} Delivery Center IDs`,
    );
  }

  resetFilters(): void {
    this.query = new InventoryV1QueryImpl();
    void this.reloadFilters();
  }

  private async pickBeesAccount(): Promise<AccountV1 | null> {
    const localAcc = await this.pickLocalAccount();
    if (!localAcc) {
      return null;
    }

    return this.accountService.findOne(
      this.envOverride!,
      localAcc.vendorAccountId,
    );
  }

  private async pickLocalAccount(): Promise<LocalAccount | null> {
    if (!this.envOverride) {
      alert('Please choose an environment first!');
      return null;
    }
    return firstValueFrom(
      this.dialogService.openAccountPicker(this.envOverride),
    );
  }
}

export const SEARCH_INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: SearchInventoryComponent,
  },
];
