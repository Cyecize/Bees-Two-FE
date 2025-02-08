import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { EDITOR_CUSTOM_LIB } from './template-payload-playground-editor.lib';
import { CancellationToken, editor, languages, Position } from 'monaco-editor';
import { JavascriptEvalService } from '../../../../api/template/js-eval/javascript-eval.service';
import { TemplatePlaygroundDialogPayload } from './template-playground-dialog.payload';

declare const monaco: typeof import('monaco-editor');

@Component({
  standalone: true,
  template: `
    <div class="dialog-content-container">
      <ngx-monaco-editor
        [options]="editorOptions"
        [(ngModel)]="userCode"
        (onInit)="onEditorInit()"
      ></ngx-monaco-editor>

      <button (click)="onTest()">Test Code</button>

      <div class="output">
        <h3>Output:</h3>
        <div *ngFor="let message of output">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './template-payload-playground-dialog.scss',
  imports: [FormsModule, NgForOf, MonacoEditorModule],
})
export class TemplatePayloadPlaygroundDialog
  extends DialogContentBaseComponent<TemplatePlaygroundDialogPayload>
  implements OnInit
{
  userCode = '';
  output: string[] = [];
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

  async onTest(): Promise<void> {
    this.output = [];

    const resp = await this.jsEvalService.eval(this.userCode, {
      arguments: this.payload.args,
      env: this.payload.env,
      run: true,
      onLog: (str) => this.output.push(str),
    });

    this.output.push(...resp.errors);

    console.log(resp);
  }
}
