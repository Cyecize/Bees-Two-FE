import { Component, OnInit } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { CountryEnvironmentService } from '../../api/env/country-environment.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { EnvPickerDialogComponent } from '../env/env-picker-dialog/env-picker-dialog.component';
import { CountryEnvironmentModel } from '../../api/env/country-environment.model';
import { NgIf } from '@angular/common';
import { EnvViewerDialogComponent } from '../env/env-viewer-dialog/env-viewer-dialog.component';
import { AppRoutingPath } from '../../app-routing.path';
import { ShowLoader } from '../../shared/loader/show.loader.decorator';
import { PlatformIdType } from '../../api/platformid/platform-id.type';
import { StringReplacerDialog } from '../../shared/dialog/dialogs/string-replacer-dialog/string-replacer-dialog.component';
import { TemplatePayloadPlaygroundDialog } from "../template-history/template/template-payload-playground-dialog";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentEnv!: CountryEnvironmentModel;
  routes = AppRoutingPath;
  platformIdTypes = PlatformIdType;

  constructor(
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
  ) {}

  openEnvDialog(): void {
    this.dialogService.open(EnvPickerDialogComponent, '', null);
  }

  ngOnInit(): void {
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });
  }

  viewEnvDetails(): void {
    this.dialogService.open(EnvViewerDialogComponent, '', this.currentEnv);
  }

  @ShowLoader()
  async generateToken(): Promise<void> {
    const res = await this.envService.getToken(this.currentEnv);
    if (!res.isSuccess) {
      alert('Error while obtaining token, check the console!');
      console.log(res);
      return;
    }

    navigator.clipboard.writeText(res.response.token);
    this.dialogService.openConfirmDialog(
      `Token for ${res.response.countryEnvironment.envName} copied to clipboard!`,
      'Success!',
      '',
    );
  }

  openPlatformDialog(type: PlatformIdType): void {
    this.dialogService.openPlatformIdDialog(this.currentEnv!, type);
  }

  openStringReplacerDialog(): void {
    this.dialogService.open(StringReplacerDialog, '', null);
  }

  openPlayground(): void {
    this.dialogService.open(
      TemplatePayloadPlaygroundDialog,
      'Playground',
      null,
    );
  }
}

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
