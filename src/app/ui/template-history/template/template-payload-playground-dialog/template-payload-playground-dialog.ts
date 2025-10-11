import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { EDITOR_CUSTOM_LIB } from './template-payload-playground-editor.lib';
import {
  JavascriptEvalService,
  JsEvalResult,
} from '../../../../api/template/js-eval/javascript-eval.service';
import { TemplatePlaygroundDialogPayload } from './template-playground-dialog.payload';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TemplatePlaygroundDialogResponse } from './template-playground-dialog.response';
import { RequestTemplateArgUtil } from '../../../../api/template/arg/request-template-arg.util';
import { GENERATED_EDITOR_LIB } from './generated-editor-lib';
import {
  ScriptLogger,
  ScriptLoggerImpl,
} from '../../../../shared/util/script-logger';

declare const monaco: typeof import('monaco-editor');

@Component({
  standalone: true,
  templateUrl: './template-payload-playground-dialog.html',
  styleUrl: './template-payload-playground-dialog.scss',
  imports: [FormsModule, NgForOf, MonacoEditorModule, NgIf, JsonPipe, NgClass],
})
export class TemplatePayloadPlaygroundDialog
  extends DialogContentBaseComponent<TemplatePlaygroundDialogPayload>
  implements OnInit
{
  userCode = '';
  output: string[] = [];
  result: JsEvalResult | null = null;
  showLogs = true;
  editorOptions = {
    theme: 'vs-light',
    language: 'javascript',
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
  };

  constructor(
    private dialogService: DialogService,
    private jsEvalService: JavascriptEvalService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.payload.code) {
      this.userCode = this.payload.code;
    }
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  async onEditorInit(): Promise<void> {
    await this.configureMonaco();
  }

  private async configureMonaco(): Promise<void> {
    const monaco = (window as any).monaco;

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      GENERATED_EDITOR_LIB,
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      EDITOR_CUSTOM_LIB,
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
      interface Args {
        ${this.payload.args.map((a) => `${a.keyName}: RequestTemplateArg`)}
      }

      /** Function arguments */
      declare const args: Args;
      `,
    );

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      lib: ['es2020', 'dom'],
      typeRoots: ['node_modules/@types'],
    });
  }

  async onTest(run?: boolean): Promise<void> {
    this.output = [];
    this.result = null;

    const scriptLogger: ScriptLogger = new ScriptLoggerImpl(true);
    try {
      const resp = await this.jsEvalService.eval(this.userCode, {
        arguments: RequestTemplateArgUtil.convertArgumentsToObj(
          this.payload.args,
        ),
        env: this.payload.env,
        context: new Map<string, any>(),
        run: run || false,
        onLog: (str) => this.output.push(str),
        scriptLogger,
      });

      this.output.push(...resp.errors);
      this.result = resp;
    } finally {
      scriptLogger.stopCapturing();
    }
  }

  protected readonly ObjectUtils = ObjectUtils;

  showCode(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(this.result?.output, null, 2),
      'JS Code Output',
    );
  }

  saveAndClose(): void {
    this.close(
      new TemplatePlaygroundDialogResponse(this.userCode?.trim() || null),
    );
  }
}
