import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { SelectSearchComponent } from '../../../../shared/form-controls/select-search/select-search.component';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import {
  EmptyPage,
  Page,
  pageToPagination,
} from '../../../../shared/util/page';
import { SharedClient } from '../../../../api/env/sharedclient/shared-client';
import {
  SharedClientQuery,
  SharedClientQueryImpl,
} from '../../../../api/env/sharedclient/shared-client.query';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { SharedClientService } from '../../../../api/env/sharedclient/shared-client.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { Observable } from 'rxjs';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { SharedClientDetailsDialogComponent } from '../shared-client-details-dialog/shared-client-details-dialog.component';
import { AddSharedClientDialogComponent } from '../add-shared-client-dialog/add-shared-client-dialog.component';

interface SharedClientQueryForm {}

@Component({
  selector: 'app-env-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    SelectSearchComponent,
    InputComponent,
    PaginationComponent,
    ReactiveFormsModule,
    TooltipSpanComponent,
  ],
  templateUrl: './shared-client-browse-dialog.html',
  styleUrl: './shared-client-browse-dialog.scss',
})
export class SharedClientBrowseDialog
  extends DialogContentBaseComponent<any>
  implements OnInit, OnDestroy
{
  currentEnv!: CountryEnvironmentModel;
  clients: Page<SharedClient> = new EmptyPage();

  query: SharedClientQuery = new SharedClientQueryImpl();
  queryForm!: FormGroup<SharedClientQueryForm>;

  constructor(
    private sharedClientService: SharedClientService,
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Browse Shared Clients');
    this.queryForm = new FormGroup({});

    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });

    // this.cd.detectChanges();
    this.queryForm.patchValue(this.query);
    await this.reloadFilters();
  }

  ngOnDestroy(): void {}

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  openAddNewClientDialog(): void {
    this.dialogService
      .open(AddSharedClientDialogComponent, 'New Shared Client', null)
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.reloadFilters();
        }
      });
  }

  viewClientDetails(client: SharedClient): void {
    this.dialogService
      .open(SharedClientDetailsDialogComponent, '', client)
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.reloadFilters();
        }
      });
  }

  async pageChanged(page: number): Promise<void> {
    this.query.page.pageNumber = page;
    await this.fetchSharedClients();
  }

  private async reloadFilters(): Promise<void> {
    this.query.page.pageNumber = 0;
    await this.fetchSharedClients();
  }

  @ShowLoader()
  private async fetchSharedClients(): Promise<boolean> {
    const res = await this.sharedClientService.search(this.query);
    if (!res.isSuccess) {
      alert('Error while searching shared clients! Check the console.');
      console.log(res);
      return false;
    }

    this.clients = res.response;
    return true;
  }

  protected readonly pageToPagination = pageToPagination;

  async clearFilters(): Promise<void> {
    this.query = new SharedClientQueryImpl();
    this.queryForm.patchValue(this.query);
    await this.reloadFilters();
  }
}
