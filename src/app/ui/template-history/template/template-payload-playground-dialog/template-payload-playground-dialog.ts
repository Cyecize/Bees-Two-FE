import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
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

declare const monaco: typeof import('monaco-editor');

@Component({
  standalone: true,
  templateUrl: './template-payload-playground-dialog.html',
  styleUrl: './template-payload-playground-dialog.scss',
  imports: [FormsModule, NgForOf, MonacoEditorModule, NgIf, JsonPipe],
})
export class TemplatePayloadPlaygroundDialog
  extends DialogContentBaseComponent<TemplatePlaygroundDialogPayload>
  implements OnInit
{
  userCode = '';
  output: string[] = [];
  result: JsEvalResult | null = null;
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
      EDITOR_CUSTOM_LIB,
    );

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
      interface RequestTemplateArg {
        id: number | null;
        type: RequestTemplateArgType;
        keyName: string;
        value: string | null;
        name: string;
      }

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
      lib: ['es2020'],
    });
  }

  async onTest(run?: boolean): Promise<void> {
    this.output = [];
    this.result = null;

    const resp = await this.jsEvalService.eval(this.userCode, {
      arguments: this.payload.args,
      env: this.payload.env,
      run: run || false,
      onLog: (str) => this.output.push(str),
    });

    this.output.push(...resp.errors);
    this.result = resp;
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
