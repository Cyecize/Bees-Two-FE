export const EDITOR_CUSTOM_LIB = `
      /** Output function */
      declare const w: (message: string) => void;
      declare const wJson: (data: any) => void;
      declare const log: (message: string) => void;
      declare const wait: async (timeMs: number) => Promise<void>;

      interface CountryEnvironment {
        id: number;
        envName: string;
        env: Env;
        countryCode: string;
        vendorId: string;
        storeId: string;
        timezone: string;
        defaultLanguage: CountryEnvironmentLanguageModel;
        languages: CountryEnvironmentLanguageModel[];
        singleLanguage: boolean;
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
      declare const env: CountryEnvironment;

      /** Function arguments */
      declare const args: Record<string, any>;

      /** Available services */
      declare const bees: Bees;
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
