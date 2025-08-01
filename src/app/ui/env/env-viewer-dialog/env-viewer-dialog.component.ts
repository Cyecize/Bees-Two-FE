import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { firstValueFrom, Observable } from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { NgForOf, NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../shared/components/copy-icon/copy-icon.component';
import { SharedClient } from '../../../api/env/sharedclient/shared-client';
import { SharedClientService } from '../../../api/env/sharedclient/shared-client.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { SharedClientDetailsDialogComponent } from '../sharedclient/shared-client-details-dialog/shared-client-details-dialog.component';
import { EditEnvDialogComponent } from '../edit-env-dialog/edit-env-dialog.component';

@Component({
  selector: 'app-env-viewer-dialog',
  standalone: true,
  imports: [NgIf, CopyIconComponent, NgForOf],
  templateUrl: './env-viewer-dialog.component.html',
  styleUrl: './env-viewer-dialog.component.scss',
})
export class EnvViewerDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;
  showAssignedClients = false;
  assignedClients: SharedClient[] = [];

  constructor(
    private envService: CountryEnvironmentService,
    private sharedClientService: SharedClientService,
    private dialogService: DialogService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  openEditEnvDialog(): void {
    this.dialogService
      .open(EditEnvDialogComponent, 'Edit Environment', this.payload)
      .afterClosed()
      .subscribe(async (refresh): Promise<void> => {
        if (refresh) {
          this.payload = (await this.envService.findById(this.payload.id))!;
        }
      });
  }

  ngOnInit(): void {
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });

    this.setTitle(this.payload.envName);
    this.fetchAssignedClients();
  }

  selectEnv(): void {
    this.envService.selectEnv(this.payload);
    this.close(null);
  }

  async unAssignClient(client: SharedClient): Promise<void> {
    const conf = await firstValueFrom(
      this.dialogService.openConfirmDialog(
        'Are you sure you want to unassign this client?',
      ),
    );

    if (!conf) {
      return;
    }

    const resp = await this.sharedClientService.unAssignEnvironment(
      client,
      this.payload,
    );

    if (!resp.isSuccess) {
      alert('Error occurred while unassigning client, check the logs!');
      console.error(resp.errors);
    }

    await this.fetchAssignedClients();
  }

  joinLanguages(): string {
    return this.payload.languages.map((l) => l.languageCode).join(', ');
  }

  private async fetchAssignedClients(): Promise<void> {
    const resp = await this.sharedClientService.findAllAssignedClients(
      this.payload,
    );

    if (!resp.isSuccess) {
      alert('Error occurred while fetching clients, check the logs!');
      console.error(resp.errors);
      return;
    }

    this.assignedClients = resp.response;
  }

  viewSharedClientDetails(client: SharedClient): void {
    this.dialogService.open(SharedClientDetailsDialogComponent, '', client);
  }
}
