import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowDealDetailsDialogPayload } from './show-deal-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';

@Component({
  selector: 'app-show-reward-setting-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-deal-details-dialog.component.html',
  styleUrl: './show-deal-details-dialog.component.scss',
})
export class ShowDealDetailsDialogComponent
  extends DialogContentBaseComponent<ShowDealDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.deal, null, 2);
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
}
