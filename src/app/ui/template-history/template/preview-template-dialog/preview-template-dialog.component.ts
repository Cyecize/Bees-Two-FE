import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { Observable } from 'rxjs';
import { DynamicTemplateComponent } from '../dynamic-template.component';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { JsonPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';

@Component({
  templateUrl: './preview-template-dialog.component.html',
  styleUrl: './preview-template-dialog.component.scss',
  standalone: true,
  imports: [
    DynamicTemplateComponent,
    EnvOverrideFieldComponent,
    NgClass,
    NgForOf,
    TooltipSpanComponent,
    NgIf,
    JsonPipe,
  ],
})
export class PreviewTemplateDialogComponent
  extends DialogContentBaseComponent<RequestTemplateView>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;
  template!: RequestTemplateView;
  processedTemplate?: RequestTemplateView;

  constructor(private envService: CountryEnvironmentService) {
    super();
  }

  ngOnInit(): void {
    this.template = this.payload;
    this.currentEnv = this.envService.getCurrentEnv()!;
    if (!this.currentEnv) {
      alert('Missing env!');
      super.close(null);
      return;
    }
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  protected readonly ObjectUtils = ObjectUtils;

  onProcessFinished(template: RequestTemplateView): void {
    this.processedTemplate = template;
  }
}
