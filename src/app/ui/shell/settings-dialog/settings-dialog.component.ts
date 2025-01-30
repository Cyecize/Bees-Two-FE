import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { BeesTokenOverrideService } from '../../../api/env/token/bees-token-override.service';
import { ObjectUtils } from '../../../shared/util/object-utils';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './settings-dialog.component.html',
  styles: `
    .setting-dialog {
      @media (min-width: 768px) {
        min-width: 600px;
      }
    }
  `,
})
export class SettingsDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  tokenExists = false;

  constructor(
    private dialogService: DialogService,
    private tokenOverrideService: BeesTokenOverrideService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return this.gearIcon();
  }

  ngOnInit(): void {
    this.tokenExists = !ObjectUtils.isNil(
      this.tokenOverrideService.getBeesToken(this.payload),
    );
  }

  openTemporaryTokenDialog(): void {
    this.dialogService.openBeesTokenOverrideDialog(this.payload);
  }
}
