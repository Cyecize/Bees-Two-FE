import { Component, EventEmitter, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { DialogService } from '../../../shared/dialog/dialog.service';

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
  styles: [
    `
      ngx-monaco-editor {
        width: 100%;
        height: 400px;
        margin-bottom: 10px;
      }

      .output {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
      }

      button {
        padding: 8px 16px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
  imports: [FormsModule, NgForOf, MonacoEditorModule],
})
export class TemplatePayloadPlaygroundDialog extends DialogContentBaseComponent<any> implements OnInit {
  userCode = '';
  output: string[] = [];
  editorOptions = {
    theme: 'vs-light',
    language: 'javascript',
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
  };

  // Create an EventEmitter for output
  w = new EventEmitter<string>();

  // Example environment variables
  env = {
    apiUrl: 'https://api.example.com',
    debugMode: true,
  };

  // Example arguments
  args = {
    userId: 123,
    action: 'test',
  };

  // Example services container
  bees = {
    rx: {
      Observable,
      firstValueFrom,
    },
    dialogService: this.dialogService,
  };

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.w.subscribe((message: string) => {
      this.output.push(message);
    });
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  async onEditorInit(): Promise<void> {
    await this.configureMonaco();
  }

  private async configureMonaco(): Promise<void> {
    const monaco = (window as any).monaco;

    // Add type definitions for auto-completion
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      /** Output function */
      declare const w: (message: string) => void;

      interface Env {
        /** API endpoint URL */
        apiUrl: string;
        /** Debug mode flag */
        debugMode: boolean;
      }

      interface BeesRx {
        /** Observable constructor */
        Observable: typeof Observable;
        /** Convert observable to promise */
        firstValueFrom: typeof firstValueFrom;
      }

      interface DialogService {
        openAccountPicker: (env: Env) => Observable<any>
      }

      interface Bees {
        /** RxJS utilities */
        rx: BeesRx;
        dialogService: DialogService;
      }

      /** Environment variables */
      declare const env: Env;

      /** Function arguments */
      declare const args: Record<string, any>;

      /** Available services */
      declare const bees: Bees;
    `);

    // Configure compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      lib: ['es2020'],
    });

    // Register custom autocomplete
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'w',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Output function: w("message")',
            insertText: 'w',
          },
          {
            label: 'env',
            kind: monaco.languages.CompletionItemKind.Variable,
            documentation: 'Environment variables (apiUrl, debugMode)',
            insertText: 'env',
          },
          {
            label: 'args',
            kind: monaco.languages.CompletionItemKind.Variable,
            documentation: 'Function arguments provided by the app',
            insertText: 'args',
          },
          {
            label: 'bees',
            kind: monaco.languages.CompletionItemKind.Module,
            documentation:
              'Available services (rx.Observable, rx.firstValueFrom)',
            insertText: 'bees',
          },
        ],
      }),
    });
  }

  async onTest(): Promise<void> {
    this.output = [];

    try {
      const userFunction = new Function(
        'w',
        'env',
        'args',
        'bees',
        `return (async () => {
          ${this.userCode}
        })();`,
      );

      // Create wrapper function for output
      const wHandler = (message: string) => this.w.emit(message);

      await userFunction(wHandler, this.env, this.args, this.bees);
    } catch (error: any) {
      this.w.emit(`❌ Error: ${error.message}`);
    }
  }
}
