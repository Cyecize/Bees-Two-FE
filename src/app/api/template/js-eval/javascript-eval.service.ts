import { EventEmitter, Injectable } from '@angular/core';
import { filter } from 'rxjs';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { RequestTemplateArg } from '../arg/request-template-arg';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { Bees, publicEnums } from '../IBees';
import { ScriptLogger } from '../../../shared/util/script-logger';

export interface JsEvalOptions {
  run: boolean;
  arguments: { [key: string]: RequestTemplateArg };
  env: CountryEnvironmentModel;
  rawWMessages?: boolean;
  context: Map<string, any>;
  stringifyJson?: boolean;
  onLog?: (str: string) => void;
  scriptLogger: ScriptLogger;
}

export interface JsEvalResult {
  success: boolean;
  errors: string[];
  output: object | string | null;
}

@Injectable({ providedIn: 'root' })
export class JavascriptEvalService {
  constructor(private bees: Bees) {}

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
        'scriptLogger',
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
        this.bees,
        options.scriptLogger,
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
      console.error(error);
    }

    return result;
  }
}
