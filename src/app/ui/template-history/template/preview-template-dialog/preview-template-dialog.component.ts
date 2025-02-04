import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { Observable } from 'rxjs';
import { DynamicTemplateComponent } from '../dynamic-template.component';

@Component({
  styles: `
    .preview-template-dialog {
      @media (min-width: 768px) {
        min-width: 600px;
      }
    }
  `,
  template: ` <div class="preview-template-dialog">
    <app-dynamic-template [data]="payload"></app-dynamic-template>
  </div>`,
  standalone: true,
  imports: [DynamicTemplateComponent],
})
export class PreviewTemplateDialogComponent
  extends DialogContentBaseComponent<RequestTemplateView>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}

  getIcon(): Observable<string> {
    return super.noIcon();
  }
}
