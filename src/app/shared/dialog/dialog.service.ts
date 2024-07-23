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
}
