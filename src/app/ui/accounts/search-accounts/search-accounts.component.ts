import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { AccountV1Service } from '../../../api/accounts/v1/account-v1.service';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import {
  AccountV1SearchQuery,
  AccountV1SearchQueryImpl,
} from '../../../api/accounts/v1/account-v1-search.query';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { TooltipSpanComponent } from "../../../shared/components/tooltip-span/tooltip-span.component";

@Component({
  selector: 'app-search-accounts',
  standalone: true,
  imports: [
    SelectSearchComponent,
    EnvOverrideFieldComponent,
    InputComponent,
    FormsModule,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
  ],
  templateUrl: './search-accounts.component.html',
  styleUrl: './search-accounts.component.scss',
})
export class SearchAccountsComponent implements OnInit {
  private envOverride?: CountryEnvironmentModel;

  query: AccountV1SearchQuery = new AccountV1SearchQueryImpl();

  accounts: AccountV1[] = [];
  fullResponse!: WrappedResponse<any>;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private accountV1Service: AccountV1Service,
  ) {}

  ngOnInit(): void {
    this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      this.reloadFilters();
    });
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.page = page;
    await this.fetchData();
  }

  async reloadFilters(): Promise<void> {
    this.query.vendorId = this.envOverride?.vendorId + '';

    this.query.page.page = 0;

    await this.fetchData();
  }

  private async fetchData(): Promise<void> {
    const response = await this.accountV1Service.searchAccounts(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.accounts = beesResponse.response;
      } else {
        this.accounts = [];
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

  openDetailsDialog(account: AccountV1): void {
    alert('details!');
    console.log(account);
  }
}

export const SEARCH_ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: SearchAccountsComponent,
  },
];
