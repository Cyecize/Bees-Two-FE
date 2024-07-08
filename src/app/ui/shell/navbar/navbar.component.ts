import { Component, OnInit } from '@angular/core';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvViewerDialogComponent } from '../../env/env-viewer-dialog/env-viewer-dialog.component';
import { EnvPickerDialogComponent } from '../../env/env-picker-dialog/env-picker-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  selectedEnv!: CountryEnvironmentModel;

  constructor(
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.envService.selectedEnv$.subscribe((env) => {
      if (env) {
        this.selectedEnv = env;
      }
    });
  }

  showCurrentEnv(): void {
    this.dialogService.open(EnvViewerDialogComponent, '', this.selectedEnv);
  }

  selectEnv(): void {
    this.dialogService.open(EnvPickerDialogComponent, '', undefined);
  }
}
