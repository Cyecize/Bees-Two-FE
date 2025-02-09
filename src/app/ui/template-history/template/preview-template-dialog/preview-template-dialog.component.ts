import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';

@Component({
  templateUrl: './preview-template-dialog.component.html',
  styleUrl: './preview-template-dialog.component.scss',
  standalone: true,
  imports: [
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

  constructor(
    private envService: CountryEnvironmentService,
    private templateRunningService: RequestTemplateRunningService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentEnv = this.envService.getCurrentEnv()!;
    if (!this.currentEnv) {
      alert('Missing env!');
      super.close(null);
      return;
    }

    this.templateRunningService
      .prepareTemplate(this.currentEnv, this.payload, (message) => {
        console.log(message);
      })
      .then((value) => {
        if (value.errors.length) {
          console.log(value.errors);
        } else {
          this.template = value.template;
        }
      });
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  protected readonly ObjectUtils = ObjectUtils;

  async sendRequest(): Promise<void> {
    if (!this.template) {
      return;
    }

    const resp = await this.templateRunningService.runOnce(
      this.currentEnv,
      this.template,
    );

    if (resp.isSuccess) {
      alert('success!');
    }

    console.log(resp);
  }
}
