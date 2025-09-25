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
import { EmptyPage, Page } from '../../../shared/util/page';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountFormDialogPayload } from './account-form-dialog.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';

interface AccountForm {
  name: FormControl<string>;
  envId: FormControl<number>;
  beesId: FormControl<string>;
  customerAccountId: FormControl<string>;
  vendorAccountId: FormControl<string>;
}

@Component({
  selector: 'app-account-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PaginationComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './account-form-dialog.component.html',
  styleUrl: './account-form-dialog.component.scss',
})
export class AccountFormDialogComponent
  extends DialogContentBaseComponent<AccountFormDialogPayload>
  implements OnInit
{
  query: LocalAccountQuery = new LocalAccountQueryImpl();
  accountsPage: Page<LocalAccount> = new EmptyPage();
  form!: FormGroup<AccountForm>;

  constructor(
    private localAccountService: LocalAccountService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Save Local Account');
    this.query.env = this.payload.env.id;

    this.form = new FormGroup<AccountForm>({
      beesId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      customerAccountId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      vendorAccountId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      name: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      envId: new FormControl<number>(this.payload.env.id, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });

    if (this.payload.account) {
      this.form.patchValue(this.payload.account);
      this.form.controls.beesId.patchValue(this.payload.account.accountId);
      this.form.controls.name.patchValue(
        this.payload.account.displayName! || this.payload.account.legalName!,
      );
      this.reloadFilters();
    }
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  reloadFilters(): void {
    this.query.page.pageNumber = 0;

    const formVal = this.form.getRawValue();

    this.query.vendorAccountId = formVal.vendorAccountId;
    this.query.customerAccountId = formVal.customerAccountId;
    this.query.beesId = formVal.beesId;
    this.query.name = formVal.name;

    this.fetch();
  }

  private async fetch(): Promise<void> {
    this.accountsPage = await this.localAccountService.searchAccounts(
      this.query,
    );
  }

  @ShowLoader()
  async onFormSubmit(): Promise<void> {
    try {
      const result = await this.localAccountService.createAccount(
        this.form.getRawValue(),
      );
      this.close(undefined);
    } catch (err) {
      alert('Could not save Account, check the logs!');
    }
  }
}
