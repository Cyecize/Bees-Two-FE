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
    fixedOverflowWidgets: true,
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

  async onEditorInit(editor: any): Promise<void> {
    await this.configureMonaco();

    // Disable CTRL + W in your browser for this to work!
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
      editor.trigger('keyboard', 'editor.action.smartSelect.expand', {});
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyW,
      () => {
        editor.trigger('keyboard', 'editor.action.smartSelect.shrink', {});
      },
    );

    // CTRL + D
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.trigger('keyboard', 'editor.action.copyLinesDownAction', {});
    });

    // Ctrl + Y: Delete Line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      editor.trigger('keyboard', 'editor.action.deleteLines', {});
    });

    // Ctrl + Shift + Z: Redo
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
      () => {
        editor.trigger('keyboard', 'redo', {});
      },
    );

    // Ctrl + Alt + L: Reformat Code
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyL,
      () => {
        editor.trigger('keyboard', 'editor.action.formatDocument', {});
      },
    );

    // Alt + Enter: Show Intentions / Quick Fix
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, () => {
      editor.trigger('keyboard', 'editor.action.quickFix', {});
    });

    // Ctrl + B: Go to Declaration/Definition
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      editor.trigger('keyboard', 'editor.action.revealDefinition', {});
    });
  }

  private async configureMonaco(): Promise<void> {
    const monaco = (window as any).monaco;

    const extraLib = `
      interface Args {
        ${this.payload.args.map(
          (a) =>
            `${a.keyName}: TypedRequestTemplateArg<${RequestTemplateArgUtil.generateType(a)}>`,
        )}
      }

      /** Function arguments */
      declare const args: Args;
      `;

    // Use setExtraLibs instead of addExtraLib to avoid adding same lib on every call!
    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
      {
        content: GENERATED_EDITOR_LIB,
      },
      {
        content: EDITOR_CUSTOM_LIB,
      },
      {
        content: extraLib,
      },
    ]);

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
    scriptLogger.logStream.subscribe((log) => this.output.push(log.message));

    try {
      const resp = await this.jsEvalService.eval(this.userCode, {
        arguments: RequestTemplateArgUtil.convertArgumentsToObj(
          this.payload.args,
        ),
        env: this.payload.env,
        context: new Map<string, any>(),
        run: run || false,
        onLog: (str) => scriptLogger.log(str, 'EVAL'),
        scriptLogger,
      });

      this.output.push(...resp.errors);
      this.result = resp;
    } catch (err) {
      console.log(err);
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
