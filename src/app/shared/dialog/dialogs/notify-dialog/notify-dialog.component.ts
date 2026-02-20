import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../dialog-content-base.component';
import { NotifyDialogPayloadModel } from './notify-dialog-payload.model';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  template: `
    <div class="p-2">
      <p>{{ message }}</p>
    </div>

    <div class="d-flex flex-wrap justify-content-center">
      <div class="p-2">
        <button (click)="close(true)" class="btn btn-dark">
          {{ acknowledgeMsg }}
        </button>
      </div>
    </div>
  `,
})
export class NotifyDialogComponent
  extends DialogContentBaseComponent<NotifyDialogPayloadModel>
  implements OnInit
{
  constructor() {
    super();
  }

  message!: string;
  acknowledgeMsg!: string;

  ngOnInit(): void {
    this.message = this.payload.message;
    this.acknowledgeMsg = this.payload.closeBtnMessage || 'Ok';
  }

  getIcon(): Observable<string> {
    return this.exclamationMarkIcon();
  }
}
