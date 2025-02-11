import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { MultienvTemplateRunnerDialogPayload } from './multienv-template-runner-dialog.payload';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { EnvViewerDialogComponent } from '../../../env/env-viewer-dialog/env-viewer-dialog.component';

@Component({
  selector: 'app-multienv-template-runner-dialog',
  standalone: true,
  imports: [JsonPipe, MonacoEditorModule, NgForOf, NgIf, TooltipSpanComponent],
  templateUrl: './multienv-template-runner-dialog.component.html',
  styleUrl: './multienv-template-runner-dialog.component.scss',
})
export class MultienvTemplateRunnerDialogComponent
  extends DialogContentBaseComponent<MultienvTemplateRunnerDialogPayload>
  implements OnInit
{
  envs: CountryEnvironmentModel[] = [];
  logs: string[] = [];
  running = false;
  runningEnvInd = 0;

  constructor(
    private dialogService: DialogService,
    private templateRunningService: RequestTemplateRunningService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectEnvs();
    this.setTitle(`Run ${this.payload.template.name}`);
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  async selectEnvs(): Promise<void> {
    this.envs = await this.dialogService.openEnvPickerMultiselect();
  }

  showInfo(env: CountryEnvironmentModel): void {
    this.dialogService.open(EnvViewerDialogComponent, '', env);
  }

  async execute(): Promise<void> {
    this.running = true;
    this.logs = [];
    try {
      for (const env of this.envs) {
        let template: RequestTemplateView = this.payload.template;
        this.logs.push('Staring execution');
        const ctx = new Map<string, any>();
        const resp = await this.templateRunningService.prepareTemplate(
          env,
          template,
          ctx,
          (msg) => this.logs.push(msg),
        );

        // TODO: Improve this to have better logging and logic to terminate execution
        if (resp.errors?.length) {
          this.logs.push(...resp.errors);
          continue;
        }

        template = resp.template;

        // TODO: Save this in arr and add button for user to view it
        const runResp = await this.templateRunningService.runOnce(
          env,
          template,
          ctx,
        );

        this.logs.push('Finished execution');

        this.runningEnvInd++;
      }
    } finally {
      this.running = false;
      this.runningEnvInd = 0;
    }
  }

  protected readonly ObjectUtils = ObjectUtils;
}
