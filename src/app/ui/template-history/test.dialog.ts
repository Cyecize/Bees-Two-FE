import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogContentBaseComponent } from '../../shared/dialog/dialogs/dialog-content-base.component';
import { DynamicTemplateComponent } from './dynamic-template.component';

@Component({
  standalone: true,
  styles: `
    .show-code-dialog {
      @media (min-width: 768px) {
        min-width: 600px;
      }
    }
  `,
  template: `
    <div class="show-code-dialog">
      <div class="p-2" style="max-height: 450px; overflow-y: auto">
        <app-dynamic-template></app-dynamic-template>
      </div>

      <div class="d-flex flex-wrap justify-content-end">
        <div class="p-2">
          <button (click)="close(false)" class="btn">Close</button>
        </div>
        <div class="p-2">
          <button class="btn btn-success" (click)="copy()">Copy</button>
        </div>
      </div>
    </div>
  `,
  imports: [DynamicTemplateComponent],
})
export class TestDialog
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}

  copy(): void {}

  getIcon(): Observable<string> {
    return this.noIcon();
  }
}
