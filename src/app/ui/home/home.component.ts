import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { CountryEnvironmentService } from '../../api/env/country-environment.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { EnvPickerDialogComponent } from '../env/env-picker-dialog/env-picker-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
  ) {}

  openEnvDialog(): void {
    this.dialogService.open(EnvPickerDialogComponent, '', null);
  }
}

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];
