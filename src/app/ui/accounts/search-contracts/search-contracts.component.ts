import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { AccountV1Service } from '../../../api/accounts/v1/account-v1.service';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { firstValueFrom, Subscription } from 'rxjs';
import {
  BeesContractQuery,
  BeesContractQueryImpl,
} from '../../../api/accounts/contracts/bees-contract.query';
import { BeesContractService } from '../../../api/accounts/contracts/bees-contract.service';
import { BeesContract } from '../../../api/accounts/contracts/bees-contract';
import { LocalAccount } from '../../../api/accounts/local/local-account';
import { ContractStatus } from '../../../api/accounts/contracts/contract-status';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import {
  EmptyPage,
  Page,
  PageImpl,
  PageWithPagination,
} from '../../../shared/util/page';
import { ContractClassificationType } from '../../../api/accounts/contracts/contract-classification-type';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-search-contracts',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    FormsModule,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
    SelectSearchComponent,
    PaginationComponent,
  ],
  templateUrl: './search-contracts.component.html',
  styleUrl: './search-contracts.component.scss',
})
export class SearchContractsComponent implements OnInit, OnDestroy {
  protected envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: BeesContractQuery = new BeesContractQueryImpl();
  contractStatuses: Page<SelectSearchItem<ContractStatus>> = new EmptyPage();
  classificationTypes: Page<SelectSearchItem<ContractClassificationType>> =
    new EmptyPage();

  contracts: BeesContract[] = [];
  fullResponse!: WrappedResponse<PageWithPagination<BeesContract>>;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private contractService: BeesContractService,
    private accountService: AccountV1Service,
  ) {}

  ngOnInit(): void {
    this.contractStatuses = new PageImpl(
      Object.values(ContractStatus).map(
        (cs) => new SelectSearchItemImpl(cs, cs, cs as ContractStatus),
      ),
    );

    this.classificationTypes = new PageImpl(
      Object.values(ContractClassificationType).map(
        (cs) =>
          new SelectSearchItemImpl(cs, cs, cs as ContractClassificationType),
      ),
    );

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      void this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  @ShowLoader()
  async fetchAll(): Promise<void> {
    const resp = await this.contractService.fetchAll(
      this.query,
      this.envOverride,
    );

    if (resp.hasError) {
      alert('There were errors during one of the requests!');
      return;
    }

    this.dialogService.openShowCodeDialog(
      JSON.stringify(resp.contracts, null, 2),
      `Showing ${resp.contracts.length} contracts.`,
    );
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  openDetailsDialog(contract: BeesContract): void {
    void this.dialogService.openBeesContractDetails(
      contract,
      this.envOverride!,
    );
  }

  async reloadFilters(): Promise<void> {
    this.query.page.page = 0;

    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    const response = await this.contractService.searchContracts(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.contracts = beesResponse.response.content;
      } else {
        this.contracts = [];
      }
    } else {
      this.contracts = [];
    }
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  addTaxId(val: any): void {
    val = val?.trim();

    if (!val) {
      return;
    }

    this.query.taxId.push(val);
    void this.reloadFilters();
  }

  removeTaxId(ind: number): void {
    this.query.taxId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickTaxIdFromAccount(): Promise<void> {
    const acc = await this.pickBeesAccount();
    if (acc && acc.taxId) {
      this.addTaxId(acc.taxId);
    }
  }

  addDDC(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.deliveryCenterId.push(val);
    void this.reloadFilters();
  }

  removeDDC(ind: number): void {
    this.query.deliveryCenterId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickDDCFromAccount(): Promise<void> {
    const acc = await this.pickBeesAccount();
    if (acc && acc.deliveryCenterId) {
      this.addDDC(acc.deliveryCenterId);
    }
  }

  addAccountId(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.accountId.push(val);
    void this.reloadFilters();
  }

  removeAccountId(ind: number): void {
    this.query.accountId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickAccountIdFromAccount(): Promise<void> {
    const acc = await this.pickLocalAccount();
    if (acc) {
      this.addAccountId(acc.beesId);
    }
  }

  addVendorId(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.vendorId.push(val);
    void this.reloadFilters();
  }

  addCurrentVendorId(): void {
    this.addVendorId(this.envOverride!.vendorId);
  }

  removeVendorId(ind: number): void {
    this.query.vendorId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickVendorIdFromEnv(): Promise<void> {
    const envs = await this.dialogService.openEnvPickerMultiselect();
    for (const env of envs) {
      this.query.vendorId.push(env.vendorId);
    }

    void this.reloadFilters();
  }

  addCustomerAccountId(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.customerAccountId.push(val);
    void this.reloadFilters();
  }

  removeCustomerAccountId(ind: number): void {
    this.query.customerAccountId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickCustomerAccountIdFromAccount(): Promise<void> {
    const acc = await this.pickLocalAccount();
    if (acc) {
      this.addCustomerAccountId(acc.customerAccountId);
    }
  }

  addVendorAccountId(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.vendorAccountId.push(val);
    void this.reloadFilters();
  }

  removeVendorAccountId(ind: number): void {
    this.query.vendorAccountId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickVendorAccountIdFromAccount(): Promise<void> {
    const acc = await this.pickLocalAccount();
    if (acc) {
      this.addVendorAccountId(acc.vendorAccountId);
    }
  }

  addStatus(item: SelectSearchItem<ContractStatus>): void {
    if (!item) {
      return;
    }

    this.query.status.push(item.objRef!);
    void this.reloadFilters();
  }

  removeStatus(ind: number): void {
    this.query.status.splice(ind, 1);
    void this.reloadFilters();
  }

  addClassificationType(
    item: SelectSearchItem<ContractClassificationType>,
  ): void {
    if (!item) {
      return;
    }

    this.query.classificationType.push(item.objRef!);
    void this.reloadFilters();
  }

  removeClassificationType(ind: number): void {
    this.query.classificationType.splice(ind, 1);
    void this.reloadFilters();
  }

  addPriceList(val: any): void {
    val = val?.trim();
    if (!val) {
      return;
    }

    this.query.priceListId.push(val);
    void this.reloadFilters();
  }

  removePriceList(ind: number): void {
    this.query.priceListId.splice(ind, 1);
    void this.reloadFilters();
  }

  async pickPriceListIdFromAccount(): Promise<void> {
    const acc = await this.pickBeesAccount();
    if (acc && acc.priceListId) {
      this.addPriceList(acc.priceListId);
    }
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
}

export const SEARCH_CONTRACTS_ROUTES: Routes = [
  {
    path: '',
    component: SearchContractsComponent,
  },
];
