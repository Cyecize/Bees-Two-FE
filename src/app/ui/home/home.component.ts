import { Component, OnInit } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { CountryEnvironmentService } from '../../api/env/country-environment.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { EnvPickerDialogComponent } from '../env/env-picker-dialog/env-picker-dialog.component';
import { CountryEnvironmentModel } from '../../api/env/country-environment.model';
import { NgIf } from '@angular/common';
import { EnvViewerDialogComponent } from '../env/env-viewer-dialog/env-viewer-dialog.component';
import { AppRoutingPath } from '../../app-routing.path';

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
}

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
