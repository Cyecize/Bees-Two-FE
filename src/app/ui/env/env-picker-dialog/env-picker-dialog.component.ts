import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvViewerDialogComponent } from '../env-viewer-dialog/env-viewer-dialog.component';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import {
  CountryEnvironmentQuery,
  CountryEnvironmentQueryImpl,
} from '../../../api/env/country-environment.query';
import {
  CountryCodeQuery,
  CountryCodeQueryImpl,
} from '../../../api/env/country-code.query';
import {
  EmptyPage,
  Page,
  PageImpl,
  pageToPagination,
} from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import { Env } from '../../../api/env/env';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { AddEnvDialogComponent } from '../add-env-dialog/add-env-dialog.component';

@Component({
  selector: 'app-env-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    SelectSearchComponent,
    InputComponent,
    PaginationComponent,
  ],
  templateUrl: './env-picker-dialog.component.html',
  styleUrl: './env-picker-dialog.component.scss',
})
export class EnvPickerDialogComponent
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  private readonly PAGE_SIZE = 5;
  currentEnv!: CountryEnvironmentModel;
  envs: Page<SelectSearchItem<Env>> = new EmptyPage();

  showMoreFilters = false;

  query: CountryEnvironmentQuery = new CountryEnvironmentQueryImpl();
  countryCodeQuery: CountryCodeQuery = new CountryCodeQueryImpl(this.query);

  envsPage: Page<CountryEnvironmentModel> = new EmptyPage();
  countryCodes: Page<SelectSearchItem<string>> = new EmptyPage();

  constructor(
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Choose Environment');
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });

    this.envs = new PageImpl(
      [new SelectSearchItemImpl<Env>('All', '', null!)].concat(
        ...Object.keys(Env).map(
          (env) => new SelectSearchItemImpl(env, env, env as Env),
        ),
      ),
    );

    this.query.page.pageSize = this.PAGE_SIZE;
    await this.reloadFilters();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  openAddEnvDialog(): void {
    this.dialogService
      .open(AddEnvDialogComponent, 'New Environment', null)
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.reloadFilters();
        }
      });
  }

  selectEnv(env: CountryEnvironmentModel): void {
    this.envService.selectEnv(env);
  }

  viewEnvDetails(env: CountryEnvironmentModel): void {
    this.dialogService.open(EnvViewerDialogComponent, '', env);
  }

  countryCodeDropdownSearch(val: string): void {
    this.countryCodeQuery.page.pageNumber = 0;
    this.countryCodeQuery.countryCode = val;
    this.query.countryCode = undefined;
    this.fetchCountryCodes();
  }

  countryCodeDropdownPageChange(page: number): void {
    this.countryCodeQuery.page.pageNumber = page;
    this.fetchCountryCodes();
  }

  countryCodeChanged(code: SelectSearchItem<string>): void {
    this.query.countryCode = code.objRef;
    if (!code.objRef) {
      this.countryCodeQuery.countryCode = undefined;
    }
    this.reloadFilters();
  }

  envNameChanged(val: any): void {
    this.query.envName = val;
    this.reloadFilters();
  }

  vendorIdChanged(val: any): void {
    this.query.vendorId = val;
    this.reloadFilters();
  }

  storeIdChanged(val: any): void {
    this.query.storeId = val;
    this.reloadFilters();
  }

  envSelected(val: SelectSearchItem<any>): void {
    this.query.env = val.objRef;
    this.reloadFilters();
  }

  pageChanged(page: number): void {
    this.query.page.pageNumber = page;
    this.fetchCountryEnvironments();
  }

  private async reloadFilters(): Promise<void> {
    this.query.page.pageNumber = 0;
    this.countryCodeQuery.page.pageNumber = 0;

    if (await this.fetchCountryEnvironments()) {
      await this.fetchCountryCodes();
    }
  }

  @ShowLoader()
  private async fetchCountryEnvironments(): Promise<boolean> {
    const res = await this.envService.searchEnvs(this.query);
    if (!res.isSuccess) {
      alert('Error while searching envs! Check the console.');
      console.log(res);
      return false;
    }

    this.envsPage = res.response;
    return true;
  }

  private async fetchCountryCodes(): Promise<void> {
    const res = await this.envService.searchCountryCodes(this.countryCodeQuery);
    if (!res.isSuccess) {
      alert('Error while fetching country codes! Check the console.');
      console.log(res);
      return;
    }
    const items = res.response.content.map(
      (cc) => new SelectSearchItemImpl(cc, cc, cc),
    );
    this.countryCodes = new PageImpl<SelectSearchItem<string>>(
      [new SelectSearchItemImpl<string>('All', '', null!)].concat(...items),
      res.response.totalElements,
      res.response.totalPages,
      res.response.pageable,
    );
  }

  protected readonly alert = alert;
  protected readonly pageToPagination = pageToPagination;
}
