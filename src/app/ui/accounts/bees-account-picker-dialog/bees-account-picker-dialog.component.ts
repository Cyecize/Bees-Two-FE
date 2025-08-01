import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { pageToPagination } from '../../../shared/util/page';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { BeesAccountPickerDialogPayload } from './bees-account-picker-dialog.payload';
import { AccountV1Service } from '../../../api/accounts/v1/account-v1.service';
import {
  AccountV1SearchQuery,
  AccountV1SearchQueryImpl,
} from '../../../api/accounts/v1/account-v1-search.query';
import { AccountV1 } from '../../../api/accounts/v1/account-v1';

@Component({
  selector: 'app-bees-account-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PaginationComponent,
    InputComponent,
    TooltipSpanComponent,
  ],
  templateUrl: './bees-account-picker-dialog.component.html',
  styleUrl: './bees-account-picker-dialog.component.scss',
})
export class BeesAccountPickerDialogComponent
  extends DialogContentBaseComponent<BeesAccountPickerDialogPayload>
  implements OnInit
{
  private readonly PAGE_SIZE = 5;
  query: AccountV1SearchQuery = new AccountV1SearchQueryImpl();
  accounts: AccountV1[] = [];

  constructor(
    private accountService: AccountV1Service,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.query.page.pageSize = this.PAGE_SIZE;
  }

  openAccountPicker(): void {
    this.dialogService
      .openAccountPicker(this.payload.env)
      .subscribe((value) => {
        if (value) {
          this.idChanged(value.beesId, true);
        }
      });
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  selectAccount(account: AccountV1): void {
    this.close(account);
  }

  async idChanged(id: string, autoChoose?: boolean): Promise<void> {
    this.query.accountId = id;
    await this.reloadFilters();
    if (this.accounts.length === 1 && autoChoose) {
      this.selectAccount(this.accounts[0]);
    }
  }

  async reloadFilters(): Promise<void> {
    this.query.page.page = 0;
    await this.fetch();
  }

  private async fetch(): Promise<void> {
    const result = await this.accountService.searchAccounts(
      this.query,
      this.payload.env,
    );

    if (!result.isSuccess) {
      this.dialogService.openRequestResultDialog(result);
      return;
    }

    this.accounts = result.response.response;
  }

  protected pageToPagination = pageToPagination;

  inputChanged(val: string): void {
    if (!val?.trim()) {
      return;
    }
    void this.idChanged(val.trim(), false);
  }
}
