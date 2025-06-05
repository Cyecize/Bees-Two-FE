import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../../shared/components/copy-icon/copy-icon.component';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { SharedClient } from '../../../../api/env/sharedclient/shared-client';
import { SharedClientService } from '../../../../api/env/sharedclient/shared-client.service';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { EnvViewerDialogComponent } from '../../env-viewer-dialog/env-viewer-dialog.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';

@Component({
  selector: 'app-shared-client-details-dialog',
  standalone: true,
  imports: [NgIf, CopyIconComponent, NgForOf, CheckboxComponent],
  templateUrl: './shared-client-details-dialog.component.html',
  styleUrl: './shared-client-details-dialog.component.scss',
})
export class SharedClientDetailsDialogComponent
  extends DialogContentBaseComponent<SharedClient>
  implements OnInit
{
  assignedEnvironments: CountryEnvironmentModel[] = [];
  showAssignedEnvironments = false;

  constructor(
    private sharedClientService: SharedClientService,
    private dialogService: DialogService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle(this.payload.name);

    this.fetchAssignedEnvs();
  }

  viewEnvDetails(env: CountryEnvironmentModel): void {
    this.dialogService.open(EnvViewerDialogComponent, '', env);
  }

  async unAssignEnv(env: CountryEnvironmentModel): Promise<void> {
    const conf = await firstValueFrom(
      this.dialogService.openConfirmDialog(
        'Are you sure you want to unassign this environment?',
      ),
    );

    if (!conf) {
      return;
    }

    const resp = await this.sharedClientService.unAssignEnvironment(
      this.payload,
      env,
    );

    if (!resp.isSuccess) {
      alert('Error occurred while unassigning environment, check the logs!');
      console.error(resp.errors);
    }

    await this.fetchAssignedEnvs();
  }

  async deleteClient(): Promise<void> {
    const conf = await firstValueFrom(
      this.dialogService.openConfirmDialog(
        `Are you sure you want to delete the client ${this.payload.name}?`,
      ),
    );

    if (conf) {
      const resp = await this.sharedClientService.delete(this.payload);
      if (!resp.isSuccess) {
        alert('Could not delete client, check the console!');
        console.error(resp.errors);
      } else {
        this.close(true);
      }
    }
  }

  async assignNewEnv(): Promise<void> {
    const selectedEnvs = await this.dialogService.openEnvPickerMultiselect();
    if (!selectedEnvs.length) {
      return;
    }

    if (this.payload.countryCode) {
      const differentCountryEnvs = selectedEnvs.filter(
        (e) => e.countryCode !== this.payload.countryCode,
      );

      if (differentCountryEnvs.length) {
        const conf = await firstValueFrom(
          this.dialogService.openConfirmDialog(
            `There are ${differentCountryEnvs.length} selections that are for a
           different country, are you sure you want to proceed?`,
          ),
        );

        if (!conf) {
          return;
        }
      }
    }

    let hasFailures = false;
    for (const env of selectedEnvs) {
      const resp = await this.sharedClientService.assignEnvironment(
        this.payload,
        env,
      );

      if (!resp.isSuccess) {
        hasFailures = true;
        console.error(resp.errors);
      }
    }

    await this.fetchAssignedEnvs();

    if (hasFailures) {
      alert('Not all environments were assigned, check the logs!');
    } else {
      alert('Assignment completed!');
    }
  }

  private async fetchAssignedEnvs(): Promise<void> {
    const resp = await this.sharedClientService.findAllEnvs(this.payload);
    if (!resp.isSuccess) {
      alert('Could not fetch assigned environments, check the console!');
      console.error(resp.errors);
    }

    this.assignedEnvironments = resp.response;
  }

  @ShowLoader()
  async getToken(): Promise<void> {
    const resp = await this.sharedClientService.getToken(this.payload);
    if (!resp.isSuccess) {
      alert('Could not get token, check the console!');
      console.log(resp.errors);
    }

    navigator.clipboard
      .writeText(resp.response.token)
      .then(() => alert('Token copied to clipboard!'));
  }
}
