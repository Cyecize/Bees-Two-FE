import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { BeesTokenOverrideService } from '../../../api/env/token/bees-token-override.service';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { ProxyService } from '../../../api/proxy/proxy.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, CheckboxComponent],
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
  implements OnInit, OnDestroy
{
  tokenExists = false;
  saveNextRequest = false;
  saveNextRequestSubscription!: Subscription;

  constructor(
    private dialogService: DialogService,
    private tokenOverrideService: BeesTokenOverrideService,
    private proxyService: ProxyService,
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

    this.saveNextRequestSubscription =
      this.proxyService.saveNextRequest$.subscribe((value) => {
        this.saveNextRequest = value;
      });
  }

  ngOnDestroy(): void {
    this.saveNextRequestSubscription.unsubscribe();
  }

  openTemporaryTokenDialog(): void {
    this.dialogService.openBeesTokenOverrideDialog(this.payload);
  }

  onSaveNextRequestClick(val: boolean): void {
    this.proxyService.setSaveNextRequest(val);
  }
}
