export const EDITOR_CUSTOM_LIB = `
      /** Output function */
      declare const w: (message: string) => void;
      declare const wJson: (data: any) => void;
      declare const log: (message: string) => void;
      declare const wait: async (timeMs: number) => Promise<void>;
      declare const scriptLogger: ScriptLogger;

      interface Observable<T> {
        subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): { unsubscribe: () => void };
        pipe(...operations: any[]): Observable<any>;
      }

      declare function firstValueFrom<T>(observable: Observable<T>): Promise<T>;

      declare const env: CountryEnvironmentModel;

      /** Shared CTX between Pre-/Post-scripts and template **/
      declare const context: Map<string, any>;

      /** Available services */
      declare const bees: IBees;
    `;

// Register custom autocomplete
// monaco.languages.registerCompletionItemProvider('javascript', {
//   provideCompletionItems: () => ({
//     suggestions: [
//       {
//         label: 'w',
//         kind: monaco.languages.CompletionItemKind.Function,
//         documentation: 'Output function: w("message")',
//         insertText: 'w',
//       },
//       {
//         label: 'wJson',
//         kind: monaco.languages.CompletionItemKind.Function,
//         documentation:
//           'Output function for any object: wJson({key: value})',
//         insertText: 'wJson',
//       },
//       {
//         label: 'log',
//         kind: monaco.languages.CompletionItemKind.Function,
//         documentation:
//           'Log something for debugging purpose',
//         insertText: 'log',
//       },
//       {
//         label: 'wait',
//         kind: monaco.languages.CompletionItemKind.Function,
//         documentation:
//           'Freeze the script execution for a specified time in milliseconds',
//         insertText: 'wait',
//       },
//       {
//         label: 'env',
//         kind: monaco.languages.CompletionItemKind.Variable,
//         documentation: 'Context environment',
//         insertText: 'env',
//       },
//       {
//         label: 'args',
//         kind: monaco.languages.CompletionItemKind.Variable,
//         documentation: 'Your custom arguments',
//         insertText: 'args',
//       },
//       {
//         label: 'bees',
//         kind: monaco.languages.CompletionItemKind.Module,
//         documentation: 'Access to the BEES II API',
//         insertText: 'bees',
//       },
//     ],
//   }),
// });
