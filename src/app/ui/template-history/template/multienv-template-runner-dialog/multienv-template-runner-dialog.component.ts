import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { MultienvTemplateRunnerDialogPayload } from './multienv-template-runner-dialog.payload';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { NgForOf, NgIf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';
import { RequestTemplateFull } from '../../../../api/template/request-template';
import { EnvViewerDialogComponent } from '../../../env/env-viewer-dialog/env-viewer-dialog.component';
import {
  ScriptLogger,
  ScriptLoggerImpl,
} from '../../../../shared/util/script-logger';

@Component({
  selector: 'app-multienv-template-runner-dialog',
  standalone: true,
  imports: [MonacoEditorModule, NgForOf, NgIf],
  templateUrl: './multienv-template-runner-dialog.component.html',
  styleUrl: './multienv-template-runner-dialog.component.scss',
})
export class MultienvTemplateRunnerDialogComponent
  extends DialogContentBaseComponent<MultienvTemplateRunnerDialogPayload>
  implements OnInit
{
  envs: CountryEnvironmentModel[] = [];
  scriptLogger: ScriptLogger = new ScriptLoggerImpl(false);
  running = false;
  runningEnvInd = 0;

  constructor(
    private dialogService: DialogService,
    private templateRunningService: RequestTemplateRunningService,
  ) {
    super();
  }

  ngOnInit(): void {
    void this.selectEnvs();
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
    this.scriptLogger.startCapturing();
    try {
      for (const env of this.envs) {
        let template: RequestTemplateFull = this.payload.template;
        console.log('Starting execution');
        const ctx = new Map<string, any>();
        const resp = await this.templateRunningService.prepareTemplate(
          env,
          template,
          ctx,
          this.scriptLogger,
        );

        // TODO: Improve this to have better logging and logic to terminate execution
        if (resp.errors?.length) {
          console.log(resp.errors);
          continue;
        }

        template = resp.template;

        // TODO: Save this in arr and add button for user to view it
        const runResp = await this.templateRunningService.runOnce(
          env,
          template,
          ctx,
          this.scriptLogger,
        );

        console.log('Finished execution');

        this.runningEnvInd++;
      }
    } finally {
      this.running = false;
      this.runningEnvInd = 0;
      this.scriptLogger.stopCapturing();
    }
  }

  protected readonly ObjectUtils = ObjectUtils;
}
