import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateFull } from '../../../../api/template/request-template';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';
import { LoaderService } from '../../../../shared/loader/loader.service';
import {
  ScriptLogger,
  ScriptLoggerImpl,
} from '../../../../shared/util/script-logger';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { PreviewTemplateDialogPayload } from './preview-template-dialog.payload';
import { PreviewTemplateTab } from './preview-template-tab';
import { TemplateDetailsComponentComponent } from '../template-details-component/template-details-component.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { PresetSearchComponent } from '../../template-presets/preset-search/preset-search.component';
import { TemplatePreviewLoggerComponent } from './components/template-preview-logger/template-preview-logger.component';
import { RequestTemplatePreset } from '../../../../api/template/arg/preset/request-template-preset';
import { TemplateArgPreviewComponent } from '../template-arg-preview/template-arg-preview.component';
import { RequestTemplateArgView } from '../../../../api/template/arg/request-template-arg';
import { InlineLoaderComponent } from '../../../../shared/components/inline-loader/inline-loader.component';

@Component({
  templateUrl: './preview-template-dialog.component.html',
  styleUrl: './preview-template-dialog.component.scss',
  standalone: true,
  imports: [
    NgForOf,
    TooltipSpanComponent,
    NgIf,
    JsonPipe,
    NgClass,
    TemplateDetailsComponentComponent,
    PresetSearchComponent,
    TemplatePreviewLoggerComponent,
    AsyncPipe,
    TemplateArgPreviewComponent,
    InlineLoaderComponent,
  ],
})
export class PreviewTemplateDialogComponent
  extends DialogContentBaseComponent<PreviewTemplateDialogPayload>
  implements OnInit, OnDestroy
{
  readonly subscriptions: Subscription[] = [];
  readonly TABS = PreviewTemplateTab;
  activeTab!: PreviewTemplateTab;
  currentEnv!: CountryEnvironmentModel;
  templateFull!: RequestTemplateFull;
  templateFullBackup!: RequestTemplateFull;
  selectedPreset?: RequestTemplatePreset;
  argsToOverride: RequestTemplateArgView[] = [];
  beesRequestDetailsVisible = true;
  isRunning = false;

  numberOfLogsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfLogsObs = this.numberOfLogsSubject.asObservable();

  private context: Map<string, any> = new Map<string, any>();
  protected readonly ObjectUtils = ObjectUtils;
  protected readonly scriptLogger: ScriptLogger = new ScriptLoggerImpl(false);

  constructor(
    private envService: CountryEnvironmentService,
    private templateRunningService: RequestTemplateRunningService,
    private loaderService: LoaderService,
    private templateService: RequestTemplateService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.activeTab = this.payload.tab;
    this.currentEnv = this.envService.getCurrentEnv()!;

    if (!this.currentEnv) {
      alert('Missing env!');
      super.close(null);
      return;
    }

    const logSub = this.scriptLogger.logStream.subscribe((logSub) => {
      this.numberOfLogsSubject.next(this.scriptLogger.getLogs().length);
    });
    this.subscriptions.push(logSub);

    await this.fetchTemplate(this.payload.template.autoInit);
  }

  private async fetchTemplate(
    initialize: boolean,
    presetId?: number,
  ): Promise<void> {
    this.selectedPreset = undefined;
    const resp = await this.templateService.getTemplate(
      this.payload.template.id,
      presetId,
    );

    if (!resp.isSuccess) {
      console.log(resp);
      alert('Could not fetch template!');
      super.close(null);
      return;
    }

    this.templateFull = JSON.parse(JSON.stringify(resp.response));
    this.templateFullBackup = resp.response;

    if (initialize) {
      await this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async initialize(retainArgs?: boolean): Promise<void> {
    const argsClone = JSON.parse(JSON.stringify(this.templateFull.arguments));

    if (this.templateFull.isInitialized) {
      this.templateFull = JSON.parse(JSON.stringify(this.templateFullBackup));
    }

    if (retainArgs) {
      this.templateFull.arguments = argsClone;
    }

    this.templateRunningService
      .prepareTemplate(
        this.currentEnv,
        this.templateFull,
        this.context,
        this.scriptLogger,
      )
      .then((value) => {
        if (value.errors.length) {
          console.log(value.errors);
        } else {
          this.templateFull = value.template;
        }
      })
      .finally(() => {
        this.scriptLogger.stopCapturing();
      });
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  showLogs(): void {
    const logsVal = this.scriptLogger
      .getLogs()
      .map((l) => l.formatted())
      .join('\n');

    this.dialogService.openShowCodeDialog(
      logsVal,
      `Logs for template ${this.payload.template.name}`,
    );
  }

  downloadLogs(): void {
    this.scriptLogger.downloadLogFile(
      `template_${this.templateFull.id}_logs.txt`,
    );
  }

  protected openTemplatePayloadDialog(): void {
    this.dialogService.openShowCodeDialog(
      ObjectUtils.formatIfJson(this.templateFull.payloadTemplate),
      'Template payload',
    );
  }

  protected async onPresetSelected(
    preset: RequestTemplatePreset | null,
  ): Promise<void> {
    this.resetArgs();
    await this.fetchTemplate(
      this.templateFull.isInitialized || false,
      preset?.id,
    );
    this.selectedPreset = preset || undefined;
  }

  async onArgsUpdate(args: RequestTemplateArgView[]): Promise<void> {
    this.argsToOverride = args;

    this.argsToOverride.forEach((arg) => {
      this.templateFull.arguments.find((a) => a.id === arg.id)!.value =
        arg.value;
    });
  }

  protected resetArgs(): void {
    this.argsToOverride = [];
    this.templateFull.arguments = JSON.parse(
      JSON.stringify(this.templateFullBackup.arguments),
    );
  }

  protected async applyArgsAndInitialize(): Promise<void> {
    await this.initialize(true);
  }

  async run(): Promise<void> {
    // this.loaderService.show();
    try {
      if (!this.templateFull) {
        return;
      }

      if (!this.templateFull.isInitialized) {
        alert('Initialize first!');
        return;
      }

      this.activeTab = PreviewTemplateTab.LOGS;
      this.isRunning = true;

      const resp = await this.templateRunningService.runOnce(
        this.currentEnv,
        this.templateFull,
        this.context,
        this.scriptLogger,
      );

      this.scriptLogger.startCapturing();

      console.log(
        `Post request result from Template ${this.templateFull.id}`,
        resp.postRequestResult,
      );

      if (this.templateFull.makeRequest && !resp.response!.isSuccess) {
        alert('Fail!');
      }

      console.log(resp);
    } finally {
      // this.loaderService.hide();
      this.scriptLogger.startCapturing();
      this.isRunning = false;
    }
  }
}
