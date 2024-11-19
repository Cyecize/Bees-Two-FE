import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowOrderDetailsDialogPayload } from './show-order-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CopyIconComponent } from '../../../shared/components/copy-icon/copy-icon.component';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { ObjectUtils } from '../../../shared/util/object-utils';

@Component({
  selector: 'app-show-order-details-dialog',
  standalone: true,
  imports: [
    RouterLink,
    CopyIconComponent,
    NgIf,
    TooltipSpanComponent,
    NgForOf,
    NgOptimizedImage,
  ],
  templateUrl: './show-order-details-dialog.component.html',
  styleUrl: './show-order-details-dialog.component.scss',
})
export class ShowOrderDetailsDialogComponent
  extends DialogContentBaseComponent<ShowOrderDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  showJson = false;

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.order, null, 2);
    this.setTitle('Order Details');
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

  boolToYesNo = ObjectUtils.boolToYesNo;
}
