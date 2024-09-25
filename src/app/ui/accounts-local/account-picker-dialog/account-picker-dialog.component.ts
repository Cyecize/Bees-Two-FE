import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { LocalAccountService } from '../../../api/accounts/local/local-account.service';
import {
  LocalAccountQuery,
  LocalAccountQueryImpl,
} from '../../../api/accounts/local/local-account.query';
import { LocalAccount } from '../../../api/accounts/local/local-account';
import { EmptyPage, Page, pageToPagination } from '../../../shared/util/page';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { AccountPickerDialogPayload } from './account-picker-dialog.payload';

@Component({
  selector: 'app-account-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PaginationComponent,
    InputComponent,
    TooltipSpanComponent,
  ],
  templateUrl: './account-picker-dialog.component.html',
  styleUrl: './account-picker-dialog.component.scss',
})
export class AccountPickerDialogComponent
  extends DialogContentBaseComponent<AccountPickerDialogPayload>
  implements OnInit
{
  private readonly PAGE_SIZE = 5;
  query: LocalAccountQuery = new LocalAccountQueryImpl();
  accountsPage: Page<LocalAccount> = new EmptyPage();

  constructor(
    private localAccountService: LocalAccountService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Pick an Account');
    this.query.env = this.payload.env.id;
    this.query.page.pageSize = this.PAGE_SIZE;
    this.reloadFilters();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  selectAccount(account: LocalAccount): void {
    this.close(account);
  }

  nameChanged(name: string): void {
    this.query.name = name;
    this.reloadFilters();
  }

  idChanged(id: string): void {
    this.query.id = id;
    this.reloadFilters();
  }

  pageChanged(page: number): void {
    this.query.page.pageNumber = page;
    this.fetch();
  }

  reloadFilters(): void {
    this.query.page.pageNumber = 0;

    this.fetch();
  }

  private async fetch(): Promise<void> {
    this.accountsPage = await this.localAccountService.searchAccounts(
      this.query,
    );
  }

  protected pageToPagination = pageToPagination;
}
