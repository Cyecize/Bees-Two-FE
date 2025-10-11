import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';
import { LoaderService } from '../../../../shared/loader/loader.service';
import {
  ScriptLogger,
  ScriptLoggerImpl,
} from '../../../../shared/util/script-logger';

@Component({
  templateUrl: './preview-template-dialog.component.html',
  styleUrl: './preview-template-dialog.component.scss',
  standalone: true,
  imports: [NgForOf, TooltipSpanComponent, NgIf, JsonPipe],
})
export class PreviewTemplateDialogComponent
  extends DialogContentBaseComponent<RequestTemplateView>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;
  template!: RequestTemplateView;
  private context: Map<string, any> = new Map<string, any>();
  protected readonly ObjectUtils = ObjectUtils;
  protected readonly scriptLogger: ScriptLogger = new ScriptLoggerImpl(false);

  constructor(
    private envService: CountryEnvironmentService,
    private templateRunningService: RequestTemplateRunningService,
    private loaderService: LoaderService,
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
      .prepareTemplate(
        this.currentEnv,
        this.payload,
        this.context,
        this.scriptLogger,
      )
      .then((value) => {
        if (value.errors.length) {
          console.log(value.errors);
        } else {
          this.template = value.template;
        }
      })
      .finally(() => {
        this.scriptLogger.stopCapturing();
      });
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  async sendRequest(): Promise<void> {
    this.loaderService.show();
    try {
      if (!this.template) {
        return;
      }

      const resp = await this.templateRunningService.runOnce(
        this.currentEnv,
        this.template,
        this.context,
        this.scriptLogger,
      );

      this.scriptLogger.startCapturing();

      console.log(
        `Post request result from Template ${this.template.id}`,
        resp.postRequestResult,
      );

      if (this.template.makeRequest && !resp.response!.isSuccess) {
        alert('Fail!');
      }

      console.log(resp);
    } finally {
      this.loaderService.hide();
      this.scriptLogger.startCapturing();
    }
  }

  downloadLogs(): void {
    this.scriptLogger.downloadLogFile(`template_${this.template.id}_logs.txt`);
  }
}
