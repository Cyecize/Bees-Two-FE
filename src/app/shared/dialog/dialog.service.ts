import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogContentBaseComponent } from './dialogs/dialog-content-base.component';
import { DialogComponent } from './dialogs/dialog.component';
import { DialogComponentPayload } from './dialogs/dialog.component.payload';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogPayload } from './dialogs/confirm-dialog/confirm-dialog-payload.model';
import { WrappedResponse } from '../util/field-error-wrapper';
import { RequestResultDialogComponent } from './dialogs/request-result-dialog/request-result-dialog.component';
import { AccountPickerDialogComponent } from '../../ui/accounts-local/account-picker-dialog/account-picker-dialog.component';
import { CountryEnvironmentModel } from '../../api/env/country-environment.model';
import { LocalAccount } from '../../api/accounts/local/local-account';
import { AccountPickerDialogPayload } from '../../ui/accounts-local/account-picker-dialog/account-picker-dialog.payload';
import { BeesToken } from '../../api/env/token/bees-token';
import { BeesTokenOverrideDialogComponent } from '../../ui/env/token/bees-token-override-dialog/bees-token-override-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private matService: MatDialog) {}

  public open(
    component: ComponentType<DialogContentBaseComponent<any>>,
    title: string,
    dataPayload: any,
  ): MatDialogRef<DialogComponent> {
    return this.matService.open(DialogComponent, {
      data: new DialogComponentPayload(title, component, dataPayload),
      panelClass: 'custom-dialog-container',
    });
  }

  public openConfirmDialog(
    message: string,
    title?: string,
    confirmMessage?: string,
  ): Observable<boolean> {
    const dialogComponentMatDialogRef = this.open(
      ConfirmDialogComponent,
      title || 'Confirm',
      new ConfirmDialogPayload(message, confirmMessage),
    );

    return dialogComponentMatDialogRef
      .afterClosed()
      .pipe(map((value) => value || false));
  }

  public openRequestResultDialog(
    response: WrappedResponse<any>,
  ): Observable<boolean> {
    const dialogComponentMatDialogRef = this.open(
      RequestResultDialogComponent,
      'Bees Response',
      response,
    );

    return dialogComponentMatDialogRef
      .afterClosed()
      .pipe(map((value) => value || false));
  }

  public openAccountPicker(
    env: CountryEnvironmentModel,
    hideActions?: boolean,
  ): Observable<LocalAccount> {
    return this.open(
      AccountPickerDialogComponent,
      '',
      new AccountPickerDialogPayload(env, hideActions),
    ).afterClosed();
  }

  public openBeesTokenOverrideDialog(
    env: CountryEnvironmentModel,
  ): Observable<BeesToken> {
    return this.open(
      BeesTokenOverrideDialogComponent,
      'Bees Token Override',
      env,
    ).afterClosed();
  }
}
