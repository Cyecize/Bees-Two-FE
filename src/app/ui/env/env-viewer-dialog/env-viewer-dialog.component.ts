import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Observable } from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../shared/components/copy-icon/copy-icon.component';

@Component({
  selector: 'app-env-viewer-dialog',
  standalone: true,
  imports: [NgIf, CopyIconComponent],
  templateUrl: './env-viewer-dialog.component.html',
  styleUrl: './env-viewer-dialog.component.scss',
})
export class EnvViewerDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;

  constructor(private envService: CountryEnvironmentService) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  ngOnInit(): void {
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });

    this.setTitle(this.payload.envName);
  }

  selectEnv(): void {
    this.envService.selectEnv(this.payload);
    this.close(null);
  }
}
