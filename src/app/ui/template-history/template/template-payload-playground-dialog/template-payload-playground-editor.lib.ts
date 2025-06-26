import { Observable } from 'rxjs';
import { CountryEnvironmentCredsPayload } from '../../../../api/env/country-environment-creds.payload';
import { GenericPickerOption } from '../../../../shared/dialog/dialogs/generic-picker-dialog/generic-picker.option';
import { LocalAccount } from '../../../../api/accounts/local/local-account';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { BeesToken } from '../../../../api/env/token/bees-token';
import { ErrorResponse } from '../../../../api/proxy/error-response';
import { BeesResponse } from '../../../../api/proxy/bees-response';
import { WrappedResponse } from '../../../../shared/util/field-error-wrapper';

export const EDITOR_CUSTOM_LIB = `
      /** Output function */
      declare const w: (message: string) => void;
      declare const wJson: (data: any) => void;
      declare const log: (message: string) => void;
      declare const wait: async (timeMs: number) => Promise<void>;

      interface Observable<T> {
        subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): { unsubscribe: () => void };
        pipe(...operations: any[]): Observable<any>;
      }

      declare function firstValueFrom<T>(observable: Observable<T>): Promise<T>;

      interface WrappedResponse<T> {
        isSuccess: boolean;
        errorResp?: ErrorResponse;
        response: BeesResponse<T>;
      }

      interface BeesRx {
        /** Observable constructor */
        Observable: typeof Observable;
        /** Convert observable to promise */
        firstValueFrom: typeof firstValueFrom;
      }

      interface DialogService {
        openAccountPicker: (env: Env) => Observable<LocalAccount>;
        openShowCodeDialog(code: string, title?: string): Observable<void>;
        openBeesTokenOverrideDialog(env: CountryEnvironmentModel): Observable<BeesToken>;
        openRequestResultDialog(response: WrappedResponse<any>): Observable<boolean>;
        async openTemplateArgPrompt(
          env: CountryEnvironmentModel,
          arg: RequestTemplateArgView,
          textarea?: boolean;
        ): Promise<string | null>;
        async openEnvPickerMultiselect(): Promise<CountryEnvironmentModel[]>;
        async openGenericMultiselect<T>(options: GenericPickerOption<T>[], title?: string): Promise<T[]>;

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

      interface HttpClient {
         get<TResponse>(url: string, options = {}): Observable<TResponse>
      }

      interface Bees {
        /** RxJS utilities */
        rx: BeesRx;
        dialogService: DialogService;
        localAccountService: LocalAccountService;
        accountV1Service: AccountV1Service;
        beesContractService: IBeesContractService;
        envService: ICountryEnvironmentService;
        orderService: IOrderService;
        http: HttpClient;
        grow: IGrowService;
        vendorService: IVendorV2Service;
        itemService: IItemService;
        sharedClients: ISharedClientService;
        promoService: IPromoService;
        dealsService: IDealsService;
        platformIdService: IPlatformIdService;
      }

      declare const env: CountryEnvironmentModel;

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
