import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { firstValueFrom, Observable } from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvViewerDialogComponent } from '../env-viewer-dialog/env-viewer-dialog.component';

@Component({
  selector: 'app-env-picker-dialog',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './env-picker-dialog.component.html',
  styleUrl: './env-picker-dialog.component.scss',
})
export class EnvPickerDialogComponent
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;
  envs: CountryEnvironmentModel[] = [];

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

    this.envs = await this.envService.getEnvs();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  selectEnv(env: CountryEnvironmentModel): void {
    this.envService.selectEnv(env);
  }

  viewEnvDetails(env: CountryEnvironmentModel): void {
    this.dialogService.open(EnvViewerDialogComponent, '', env);
  }
}
