import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowAccountDetailsDialogPayload } from './show-account-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { AccountFormDialogComponent } from '../../accounts-local/account-form-dialog/account-form-dialog.component';
import { AccountFormDialogPayload } from '../../accounts-local/account-form-dialog/account-form-dialog.payload';

@Component({
  selector: 'app-show-account-details-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-account-details-dialog.component.html',
  styleUrl: './show-account-details-dialog.component.scss',
})
export class ShowAccountDetailsDialogComponent
  extends DialogContentBaseComponent<ShowAccountDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.account, null, 2);
  }

  getEditRoute(): string {
    return 'TODO';
  }

  getEditRawRoute(): string {
    return 'TODO';
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    alert('bout 2 delete!');
  }

  saveLocally(): void {
    this.dialogService.open(
      AccountFormDialogComponent,
      '',
      new AccountFormDialogPayload(
        this.payload.selectedEnv!,
        this.payload.account,
      ),
    );
  }
}
