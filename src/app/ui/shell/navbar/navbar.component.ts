import { Component, OnInit } from '@angular/core';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvViewerDialogComponent } from '../../env/env-viewer-dialog/env-viewer-dialog.component';
import { UserService } from '../../../api/user/user.service';
import { User } from '../../../api/user/user';
import { RouterLink } from '@angular/router';
import { AppRoutingPath } from '../../../app-routing.path';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { SharedClientBrowseDialog } from '../../env/sharedclient/shared-client-browse-dialog/shared-client-browse-dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, NgOptimizedImage, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  selectedEnv!: CountryEnvironmentModel;
  currentUser?: User;
  routes = AppRoutingPath;

  constructor(
    private envService: CountryEnvironmentService,
    private dialogService: DialogService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.envService.selectedEnv$.subscribe((env) => {
      if (env) {
        this.selectedEnv = env;
      }
    });

    this.userService.currentUser$.subscribe(
      (user) => (this.currentUser = user),
    );
  }

  showCurrentEnv(): void {
    this.dialogService.open(EnvViewerDialogComponent, '', this.selectedEnv);
  }

  selectEnv(): void {
    this.dialogService.openEnvPicker();
  }

  openSharedClientBrowser(): void {
    this.dialogService.open(SharedClientBrowseDialog, '', null);
  }

  openAccountPicker(): void {
    this.dialogService.openAccountPicker(this.selectedEnv, true);
  }

  openSettingsDialog(): void {
    this.dialogService.open(
      SettingsDialogComponent,
      'Settings',
      this.selectedEnv,
    );
  }
}
