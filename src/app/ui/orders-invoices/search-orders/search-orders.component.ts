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

import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { ObjectUtils } from '../../../shared/util/object-utils';
import {
  OrderQuery,
  OrderQueryImpl,
} from '../../../api/orders/dto/order.query';
import { Order } from '../../../api/orders/dto/order';
import { OrderSearchResult } from '../../../api/orders/dto/order-search-result';
import { OrderService } from '../../../api/orders/order.service';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { OrderStatus } from '../../../api/orders/order.status';
import { OrderStatusCondition } from '../../../api/orders/order-status-condition';
import { SortDirection } from '../../../shared/util/sort.query';
import { OrderOrderbyType } from '../../../api/orders/order.orderby.type';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { EmptyPage, PageImpl } from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import { ShowOrderDetailsDialogComponent } from '../show-order-details-dialog/show-order-details-dialog.component';
import { ShowOrderDetailsDialogPayload } from '../show-order-details-dialog/show-order-details-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-search-orders',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
    FormsModule,
    CheckboxComponent,
    SelectSearchComponent,
    SelectComponent,
    MatDatepicker,
    MatDatepickerInput,
  ],
  templateUrl: './search-orders.component.html',
  styleUrl: './search-orders.component.scss',
})
export class SearchOrdersComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: OrderQuery = new OrderQueryImpl();

  orders: Order[] = [];
  fullResponse!: WrappedResponse<OrderSearchResult>;
  orderStatuses: SelectOption[] = [];
  orderStatusStrategies: SelectOption[] = [];
  orderDirections: SelectOption[] = [];
  orderByOptions: PageImpl<SelectSearchItem<OrderOrderbyType>> =
    new EmptyPage();

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      if (!ObjectUtils.isNil(this.envOverride)) {
        this.reloadFilters();
      }
    });

    this.orderStatuses = Object.keys(OrderStatus).map(
      (st) => new SelectOptionKey(st),
    );
    this.orderStatusStrategies = Object.keys(OrderStatusCondition).map(
      (st) => new SelectOptionKey(st),
    );
    this.orderDirections = Object.keys(SortDirection).map(
      (st) => new SelectOptionKey(st),
    );
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  async reloadFilters(): Promise<void> {
    // this.query.vendorId = this.envOverride?.vendorId + '';

    this.orderByOptions = new PageImpl<SelectSearchItem<OrderOrderbyType>>(
      Object.keys(OrderOrderbyType)
        .filter((val) => !this.query.orderBy.includes(val as OrderOrderbyType))
        .map(
          (val) => new SelectSearchItemImpl(val, val, val as OrderOrderbyType),
        ),
    );

    this.query.page.page = 0;

    await this.fetchData();
  }

  @ShowLoader()
  private async fetchData(): Promise<boolean> {
    const response = await this.orderService.searchOrders(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.orders = beesResponse.response.orders;
      } else {
        this.orders = [];
      }

      return true;
    }

    return false;
  }

  @ShowLoader()
  async fetchAllPages(): Promise<void> {
    const res = await this.doFetchAllPages();
    alert('Printing JSON in the console!');
    console.log(JSON.stringify(res));

    console.log(`Found ${res.length} orders`);
    console.log('Filters: ', this.query);

    this.dialogService.openShowCodeDialog(
      JSON.stringify(res, null, 2),
      `Orders (${res.length})`,
    );
  }

  private async doFetchAllPages(): Promise<Order[]> {
    return this.orderService.fetchAllPages(this.query, this.envOverride);
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  openDetailsDialog(order: Order): void {
    this.dialogService.open(
      ShowOrderDetailsDialogComponent,
      '',
      new ShowOrderDetailsDialogPayload(order, this.envOverride),
    );
  }

  async deliveryStartDateChange(date: Date): Promise<void> {
    const month = (date.getMonth() + 1 + '').padStart(2, '0');
    const day = (date.getDate() + '').padStart(2, '0');

    this.query.startDeliveryDate = `${date.getFullYear()}-${month}-${day}`;
    await this.reloadFilters();
  }

  async deliveryEndDateChange(date: Date): Promise<void> {
    const month = (date.getMonth() + 1 + '').padStart(2, '0');
    const day = (date.getDate() + '').padStart(2, '0');

    this.query.endDeliveryDate = `${date.getFullYear()}-${month}-${day}`;
    await this.reloadFilters();
  }

  async updatedSinceDateChange(date: Date): Promise<void> {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
    );

    this.query.updatedSince = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    await this.reloadFilters();
  }

  async startCreateAtDateChange(date: Date): Promise<void> {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
    );

    this.query.startCreateAt = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    await this.reloadFilters();
  }

  async endCreateAtDateChange(date: Date): Promise<void> {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
    );

    this.query.endCreateAt = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    await this.reloadFilters();
  }

  async removeOrderBy(orderBy: OrderOrderbyType): Promise<void> {
    if (!this.query.orderBy.includes(orderBy)) {
      return;
    }

    this.query.orderBy.splice(this.query.orderBy.indexOf(orderBy), 1);
    await this.reloadFilters();
  }

  async addOrderBy(orderBy: OrderOrderbyType): Promise<void> {
    if (ObjectUtils.isNil(orderBy) || this.query.orderBy.includes(orderBy)) {
      return;
    }

    this.query.orderBy.push(orderBy);
    await this.reloadFilters();
  }

  async removeOrderId(orderId: string): Promise<void> {
    if (!this.query.orderIds.includes(orderId)) {
      return;
    }

    this.query.orderIds.splice(this.query.orderIds.indexOf(orderId), 1);
    await this.reloadFilters();
  }

  async addOrderId(orderId: string): Promise<void> {
    if (ObjectUtils.isNil(orderId) || this.query.orderIds.includes(orderId)) {
      return;
    }

    this.query.orderIds.push(orderId);
    await this.reloadFilters();
  }

  async pickBeesAccId(): Promise<void> {
    this.dialogService
      .openAccountPicker(this.envOverride!)
      .subscribe(async (acc) => {
        if (acc) {
          this.query.beesAccountId = acc.beesId;
          await this.reloadFilters();
        }
      });
  }

  async pickVendorAccId(): Promise<void> {
    this.dialogService
      .openAccountPicker(this.envOverride!)
      .subscribe(async (acc) => {
        if (acc) {
          this.query.vendorAccountId = acc.vendorAccountId;
          await this.reloadFilters();
        }
      });
  }

  async pickDDCId(): Promise<void> {
    this.dialogService
      .openBeesAccountPicker(this.envOverride!)
      .subscribe(async (acc) => {
        if (acc) {
          this.query.deliveryCenterId = acc.deliveryCenterId;
          await this.reloadFilters();
        }
      });
  }
}

export const SEARCH_ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: SearchOrdersComponent,
  },
];
