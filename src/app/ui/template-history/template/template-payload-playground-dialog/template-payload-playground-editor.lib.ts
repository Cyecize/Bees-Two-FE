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
        openAccountPicker: (env: Env) => Observable<any>;
        openShowCodeDialog(code: string, title?: string): Observable<void>;
        async openTemplateArgPrompt(
          env: CountryEnvironmentModel,
          arg: RequestTemplateArgView,
          textarea?: boolean
        ): Promise<string | null>;
      }

      interface LocalAccount {
        name: string;
        envId: number;
        env: CountryEnvironmentModel;
        beesId: string;
        customerAccountId: string;
        vendorAccountId: string;
      }

      interface LocalAccountService {
        async createFromBeesAccountIfNotExists(
          env: CountryEnvironmentModel,
          beesAccount: AccountV1): Promise<LocalAccount | null>;
      }

      interface AccountV1Service {
        async findOne(
          env: CountryEnvironmentModel,
          vendorAccountId?: string,
          customerAccountId?: string,
          ): Promise<AccountV1 | null>;
      }

      interface Bees {
        /** RxJS utilities */
        rx: BeesRx;
        dialogService: DialogService;
        localAccountService: LocalAccountService;
        accountV1Service: AccountV1Service;
      }

      declare const env: CountryEnvironment;

      /** Shared CTX between Pre-/Post-scripts and template **/
      declare const context: Map<string, any>;

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
