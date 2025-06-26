import { EventEmitter, Injectable } from '@angular/core';
import { filter, firstValueFrom, Observable } from 'rxjs';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { RequestTemplateArg } from '../arg/request-template-arg';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { LocalAccountService } from '../../accounts/local/local-account.service';
import { AccountV1Service } from '../../accounts/v1/account-v1.service';
import { CountryEnvironmentService } from '../../env/country-environment.service';
import { HttpClientSecuredService } from '../../../shared/http/http-client-secured.service';
import { GrowService } from '../../grow/grow.service';
import { BeesContractService } from '../../accounts/contracts/bees-contract.service';
import { OrderService } from '../../orders/order.service';
import { VendorV2Service } from '../../vendor/vendor-v2.service';
import { ItemService } from '../../items/item.service';
import { SharedClientService } from '../../env/sharedclient/shared-client.service';
import { Env } from '../../env/env';
import { BeesEntity } from '../../common/bees-entity';
import { PromoType } from '../../promo/promo-type';
import { PromoService } from '../../promo/promo.service';

export interface JsEvalOptions {
  run: boolean;
  arguments: { [key: string]: RequestTemplateArg };
  env: CountryEnvironmentModel;
  rawWMessages?: boolean;
  context: Map<string, any>;
  stringifyJson?: boolean;
  onLog?: (str: string) => void;
}

export interface JsEvalResult {
  success: boolean;
  errors: string[];
  output: object | string | null;
}

@Injectable({ providedIn: 'root' })
export class JavascriptEvalService {
  constructor(
    private dialogService: DialogService,
    private localAccountService: LocalAccountService,
    private accountV1Service: AccountV1Service,
    private envService: CountryEnvironmentService,
    private http: HttpClientSecuredService,
    private growService: GrowService,
    private beesContractService: BeesContractService,
    private orderService: OrderService,
    private vendorService: VendorV2Service,
    private itemService: ItemService,
    private sharedClientService: SharedClientService,
    private promoService: PromoService,
  ) {}

  public async eval(
    code: string | null,
    options: JsEvalOptions,
  ): Promise<JsEvalResult> {
    if (!code) {
      return { success: true, output: null, errors: [] };
    }
    const logsOutput: EventEmitter<string> = new EventEmitter<string>();
    if (options.onLog) {
      logsOutput
        .pipe(filter((val) => !ObjectUtils.isNil(val)))
        .subscribe(options.onLog);
    }

    const beesObject = {
      rx: {
        Observable,
        firstValueFrom,
      },
      dialogService: this.dialogService,
      localAccountService: this.localAccountService,
      accountV1Service: this.accountV1Service,
      envService: this.envService,
      http: this.http,
      grow: this.growService,
      beesContractService: this.beesContractService,
      orderService: this.orderService,
      vendorService: this.vendorService,
      itemService: this.itemService,
      sharedClients: this.sharedClientService,
      promoService: this.promoService,
    };

    const publicEnums = {
      Env: Env,
      BeesEntity: BeesEntity,
      PromoType: PromoType,
    };

    const result: JsEvalResult = {
      output: null,
      success: false,
      errors: [],
    };

    try {
      const userFunction = new Function(
        'w',
        'wJson',
        'log',
        'wait',
        'env',
        'args',
        'context',
        'bees',
        ...Object.keys(publicEnums),
        `return (async () => {
          ${code}
        })();`,
      );

      if (!options.run) {
        // new Function does a syntax check, so no need to manually check anything
        result.success = true;
        return result;
      }

      const messages: string[] = [];
      let objValue: any = null;
      const wHandler = (message: string): void => {
        messages.push(message);
      };
      const wJsonHandler = (data: any): void => (objValue = data);
      const logHandler = (msg: string): void => {
        console.log(`User JS: ${msg}`);
        logsOutput.emit(msg);
      };

      const waitHandler = async (timeMs: number): Promise<void> => {
        return new Promise((res) => {
          setTimeout(() => res(), timeMs);
        });
      };

      await userFunction(
        wHandler,
        wJsonHandler,
        logHandler,
        waitHandler,
        options.env,
        options.arguments,
        options.context,
        beesObject,
        ...Object.values(publicEnums),
      );

      let output;
      if (ObjectUtils.isNil(objValue) && messages.length > 0) {
        const messagesToStr = messages.join('');
        output = options.rawWMessages
          ? messagesToStr
          : JSON.parse(messagesToStr);
      } else {
        output = objValue;
      }

      if (options.stringifyJson) {
        output = JSON.stringify(output);
      }

      result.output = output;
      result.success = true;
    } catch (error: any) {
      result.errors.push(`❌ Error: ${error.message}`);
    }

    return result;
  }
}
