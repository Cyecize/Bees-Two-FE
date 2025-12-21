import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateFull } from '../../../../api/template/request-template';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  Subscription,
} from 'rxjs';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { RequestTemplateRunningService } from '../../../../api/template/request-template-running.service';
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
import { MultienvPickerComponent } from './components/multienv-picker/multienv-picker.component';

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
    MultienvPickerComponent,
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

  isMultiEnvRun = false;
  envsToRun: CountryEnvironmentModel[] = [];
  runningEnvIndex?: number;

  numberOfLogsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfLogsObs = this.numberOfLogsSubject.asObservable();
  currentLog?: string;

  private context: Map<string, any> = new Map<string, any>();
  protected readonly ObjectUtils = ObjectUtils;
  protected readonly scriptLogger: ScriptLogger = new ScriptLoggerImpl(false);

  constructor(
    private envService: CountryEnvironmentService,
    private templateRunningService: RequestTemplateRunningService,
    private templateService: RequestTemplateService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.isMultiEnvRun = this.payload.isMultiEnvRun;
    this.activeTab = this.payload.tab;
    this.currentEnv = this.envService.getCurrentEnv()!;

    if (!this.currentEnv) {
      alert('Missing env!');
      super.close(null);
      return;
    }

    const logSub = this.scriptLogger.logStream.subscribe((logSub) => {
      this.numberOfLogsSubject.next(this.scriptLogger.getLogs().length);
      this.currentLog = logSub.formatted();
    });
    this.subscriptions.push(logSub);

    if (this.isMultiEnvRun) {
      await this.openEnvPicker();
    }
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

    if (initialize && !this.isMultiEnvRun) {
      await this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async initialize(retainArgs?: boolean): Promise<void> {
    if (this.isRunning) {
      alert('Another process is running!');
      return;
    }

    if (this.isMultiEnvRun) {
      alert('This function does not support multi env run, please fix!');
      return;
    }

    this.context = new Map<string, any>();
    this.setRunning();

    try {
      const resp = await this.initializeForEnv(
        this.currentEnv!,
        this.context,
        retainArgs,
      );
      if (resp) {
        this.templateFull = resp;
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async initializeForEnv(
    env: CountryEnvironmentModel,
    ctx: Map<string, any>,
    retainArgs?: boolean,
  ): Promise<RequestTemplateFull | null> {
    const argsClone = JSON.parse(JSON.stringify(this.templateFull.arguments));

    if (this.templateFull.isInitialized) {
      this.templateFull = JSON.parse(JSON.stringify(this.templateFullBackup));
    }

    if (retainArgs) {
      this.templateFull.arguments = argsClone;
    }

    try {
      const res = await this.templateRunningService.prepareTemplate(
        env,
        this.templateFull,
        ctx,
        this.scriptLogger,
      );

      this.scriptLogger.startCapturing();
      if (res.errors.length) {
        console.log(res.errors);
      } else {
        return res.template;
      }
    } finally {
      this.scriptLogger.stopCapturing();
    }

    return null;
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
    if (this.isRunning) {
      alert('Another process is running!');
      return;
    }

    if (!this.templateFull) {
      return;
    }

    try {
      this.activeTab = PreviewTemplateTab.LOGS;
      this.setRunning();

      await this.runForEnv(this.currentEnv, this.templateFull, this.context);
    } finally {
      this.isRunning = false;
    }
  }

  private async runForEnv(
    env: CountryEnvironmentModel,
    template: RequestTemplateFull,
    ctx: Map<string, any>,
  ): Promise<void> {
    try {
      if (!template.isInitialized) {
        alert('Initialize first!');
        return;
      }

      const resp = await this.templateRunningService.runOnce(
        env,
        this.templateFull,
        ctx,
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
      this.scriptLogger.stopCapturing();
    }
  }

  async runAllEnvs(): Promise<void> {
    if (!this.envsToRun.length) {
      alert('No selected envs!');
    }

    this.activeTab = PreviewTemplateTab.LOGS;

    try {
      this.setRunning();

      this.runningEnvIndex = 0;
      for (const env of this.envsToRun) {
        this.runningEnvIndex++;
        const ctx = new Map<string, any>();

        const initializedTemplate = await this.initializeForEnv(env, ctx, true);

        if (!initializedTemplate) {
          alert(`Failed to initialize template for env ${env.envName}`);
          const proceed = await firstValueFrom(
            this.dialogService.openConfirmDialog(
              'Proceed with other envs?',
              'Confirm',
              'Proceed',
            ),
          );

          if (!proceed) {
            return;
          }

          continue;
        }

        await this.runForEnv(env, initializedTemplate, ctx);
      }
    } finally {
      this.runningEnvIndex = undefined;
      this.isRunning = false;
    }
  }

  private setRunning(): void {
    this.isRunning = true;
    this.currentLog = '';
  }

  async openEnvPicker(): Promise<void> {
    const envs = await this.dialogService.openEnvPickerMultiselect();
    const newEnvs = envs.filter(
      (e) => !this.envsToRun.find((e2) => e2.id === e.id),
    );
    this.envsToRun.push(...newEnvs);
  }
}
