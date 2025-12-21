import {
  EventEmitter,
  Injectable,
  ViewContainerRef,
  ɵcompileComponent,
} from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { RelayService } from '../relay/relay.service';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { RequestTemplateFull } from './request-template';
import { firstValueFrom, Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import {
  RequestTemplateArg,
  RequestTemplateArgView,
} from './arg/request-template-arg';
import { DialogService } from '../../shared/dialog/dialog.service';
import {
  JavascriptEvalService,
  JsEvalResult,
} from './js-eval/javascript-eval.service';
import { RequestTemplateArgUtil } from './arg/request-template-arg.util';
import { BeesParam } from '../common/bees-param';
import { StringUtils } from '../../shared/util/string-utils';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RequestTemplatePayloadType } from './request-template-payload.type';
import * as angularCompiler from '@angular/compiler';
import { RequestTemplateUtil } from './request-template.util';
import { ScriptLogger } from '../../shared/util/script-logger';
import { TemplateArgPromptType } from './arg/template-arg-prompt.type';

// This is required in order to retain the angular compiler import as production build removes unneeded imports
// The import is needed to be present in order to dynamically compile, but not actually used in this component
const compilerImport = angularCompiler;

@Injectable({ providedIn: 'root' })
export class RequestTemplateRunningService {
  private viewContainerRef!: ViewContainerRef;

  constructor(
    private proxyService: ProxyService,
    private relayService: RelayService,
    private dialogService: DialogService,
    private jsEvalService: JavascriptEvalService,
  ) {}

  public setViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  /*
  TODO: refactor this as these request now are not aware that there may be multiple envs ran, so this is temporary
   */

  public async runOnce(
    env: CountryEnvironmentModel,
    template: RequestTemplateFull,
    context: Map<string, any>,
    scriptLogger: ScriptLogger,
  ): Promise<{
    response: WrappedResponse<BeesResponse<any>> | null;
    postRequestResult: JsEvalResult | null;
  }> {
    let response = null;

    if (template.makeRequest) {
      let responseObservable: Observable<BeesResponse<any>>;
      if (template.dataIngestionVersion) {
        responseObservable = this.relayService.send(
          template.entity,
          template.method!,
          template.dataIngestionVersion,
          template.headers,
          template.payloadTemplate,
          env.id,
          template.id,
          template.saveInHistory,
        );
      } else {
        responseObservable = this.proxyService.makeRequest({
          templateId: template.id,
          data: template.payloadTemplate?.trim()
            ? JSON.parse(template.payloadTemplate)
            : null,
          headers: template.headers,
          method: template.method!,
          entity: template.entity,
          saveInHistory: template.saveInHistory,
          targetEnv: env.id,
          endpoint: template.endpoint!,
          queryParams: template.queryParams,
        });
      }

      response = await new FieldErrorWrapper(
        () => responseObservable,
      ).execute();

      context.set('response', response.response);
    }

    let postRequestResult: JsEvalResult | null = null;

    if (
      (response?.isSuccess || !template.makeRequest) &&
      template.postRequestScript?.trim()
    ) {
      scriptLogger.startCapturing();
      console.log(`Executing Post-Request script for template ${template.id}`);

      postRequestResult = await this.jsEvalService.eval(
        template.postRequestScript,
        {
          run: true,
          context: context,
          arguments: RequestTemplateArgUtil.convertArgumentsToObj(
            template.arguments,
          ),
          env: env,
          onLog: (str) => scriptLogger.log(str, 'POST_REQUEST'),
          scriptLogger,
        },
      );
    }

    return {
      postRequestResult,
      response,
    };
  }

  /**
   *
   * @param env
   * @param template - argument is deep-cloned, so original object is untouched
   * @param context
   * @param scriptLogger
   */
  public async prepareTemplate(
    env: CountryEnvironmentModel,
    template: RequestTemplateFull,
    context: Map<string, any>,
    scriptLogger: ScriptLogger,
  ): Promise<{
    template: RequestTemplateFull;
    errors: string[];
  }> {
    if (template.isInitialized) {
      throw new Error('Template is already initialized');
    }
    const logEmitter = new EventEmitter<string>();
    logEmitter.subscribe((val) => scriptLogger.logAndPrint(val, 'SCRIPT_LOG'));
    // Deep cloning the object
    template = JSON.parse(JSON.stringify(template));
    template.isInitialized = true;

    scriptLogger.startCapturing();
    logEmitter.emit('Retrieving args')
    const args = await this.retrieveArguments(env, template.arguments);
    logEmitter.emit('Retrieved args');
    console.info('Using arguments', args);
    scriptLogger.stopCapturing();

    const promises: Promise<any>[] = [];
    const errors: string[] = [];

    if (template.preRequestScript?.trim()) {
      scriptLogger.startCapturing();
      logEmitter.emit(`Running Pre-Request script for template ${template.id}`);
      const res = await this.jsEvalService.eval(template.preRequestScript, {
        context: context,
        env: env,
        run: true,
        arguments: args,
        onLog: (msg) => logEmitter.emit(`PRE_REQUEST: ${msg}`),
        scriptLogger,
      });
      scriptLogger.stopCapturing();

      errors.push(...res.errors);

      if (!res.success) {
        logEmitter.emit(
          `Pre-Request failed, stopping execution of template ${template.id}`,
        );
        return {
          template,
          errors,
        };
      }

      logEmitter.emit(
        `Completed Pre-Request script for template ${template.id}`,
      );
    }

    const endpointPromise = this.jsEvalService.eval(
      'wJson({value: `' + template.endpoint + '`})',
      {
        run: true,
        onLog: (msg) => logEmitter.emit(`ENDPOINT: ${msg}`),
        arguments: args,
        env: env,
        context: context,
        scriptLogger,
      },
    );

    promises.push(endpointPromise);
    void endpointPromise.then((value) => {
      if (!value.success) {
        logEmitter.emit('Error while setting endpoint!');
      } else {
        template.endpoint = (value.output as any).value;
        logEmitter.emit(`Setting endpoint as ${template.endpoint}`);
      }

      errors.push(...value.errors);
    });

    this.evalAndSetParams(
      env,
      template,
      args,
      context,
      template.queryParams,
      promises,
      errors,
      logEmitter,
      scriptLogger,
    );
    this.evalAndSetParams(
      env,
      template,
      args,
      context,
      template.headers,
      promises,
      errors,
      logEmitter,
      scriptLogger,
    );

    // eslint-disable-next-line n/no-unsupported-features/es-builtins
    await Promise.allSettled(promises);

    if (!template.payloadTemplate?.trim()) {
      return {
        template,
        errors,
      };
    }

    switch (template.payloadType) {
      case RequestTemplatePayloadType.ANGULAR_TEMPLATE:
        template.payloadTemplate = await this.compileAngularTemplate(
          RequestTemplateUtil.encodePayload(template.payloadTemplate)!,
          args,
          context,
          env,
        );
        break;
      case RequestTemplatePayloadType.JAVASCRIPT:
        scriptLogger.startCapturing();
        template.payloadTemplate = await this.compileJsTemplate(
          template,
          args,
          context,
          env,
          errors,
          logEmitter,
          scriptLogger,
        );
        scriptLogger.stopCapturing();
        break;
      case RequestTemplatePayloadType.PLAIN_TEXT:
        // Do nothing
        break;
      default:
        throw new Error(
          `Unsupported template payload type ${template.payloadType}`,
        );
    }

    return {
      template: template,
      errors: errors,
    };
  }

  private evalAndSetParams(
    env: CountryEnvironmentModel,
    template: RequestTemplateFull,
    args: { [key: string]: RequestTemplateArg },
    context: Map<string, any>,
    params: BeesParam[],
    promises: Promise<any>[],
    errors: string[],
    logEmitter: EventEmitter<string>,
    scriptLogger: ScriptLogger,
  ): void {
    for (const param of params) {
      const paramPromise = this.jsEvalService.eval(
        'wJson({value: `' + param.value + '`})',
        {
          run: true,
          onLog: (msg) =>
            logEmitter.emit(
              `Header (${param.name}) for template ${template.id}: ${msg}`,
            ),
          arguments: args,
          env: env,
          context: context,
          scriptLogger,
        },
      );

      promises.push(paramPromise);
      void paramPromise.then((value) => {
        if (!value.success) {
          logEmitter.emit(
            `Failed to set value for param ${param.name} for template ${template.id}!`,
          );
        } else {
          param.value = (value.output as any).value;
          logEmitter.emit(
            `Setting param ${param.name} as ${param.value} for template ${template.id}`,
          );
        }

        errors.push(...value.errors);
      });
    }
  }

  private async retrieveArguments(
    env: CountryEnvironmentModel,
    args: RequestTemplateArgView[],
  ): Promise<{ [key: string]: RequestTemplateArg }> {
    for (const arg of args) {
      if (
        arg.promptType === TemplateArgPromptType.ALWAYS ||
        (arg.promptType === TemplateArgPromptType.IF_EMPTY &&
          !arg.value &&
          arg.required)
      ) {
        arg.value = await this.promptArg(env, arg);
      }
    }

    return RequestTemplateArgUtil.convertArgumentsToObj(args);
  }

  private async promptArg(
    env: CountryEnvironmentModel,
    arg: RequestTemplateArgView,
  ): Promise<string | null> {
    return await this.dialogService.openTemplateArgPrompt(
      env,
      arg,
      undefined,
      true,
    );
  }

  private async compileJsTemplate(
    template: RequestTemplateFull,
    args: { [key: string]: RequestTemplateArg },
    context: Map<string, any>,
    env: CountryEnvironmentModel,
    errors: string[],
    logEmitter: EventEmitter<string>,
    scriptLogger: ScriptLogger,
  ): Promise<string | null> {
    this.viewContainerRef.clear();
    logEmitter.emit(`Running Template script for template ${template.id}`);
    const res = await this.jsEvalService.eval(template.payloadTemplate, {
      context: context,
      env: env,
      run: true,
      stringifyJson: true,
      arguments: args,
      onLog: (msg) => logEmitter.emit(`TEMPLATE: ${msg}`),
      scriptLogger,
    });

    errors.push(...res.errors);

    if (!res.success) {
      logEmitter.emit(`Template script failed, for template ${template.id}`);
    }

    logEmitter.emit(`Completed Template script for template ${template.id}`);

    return res.output as string | null;
  }

  private async compileAngularTemplate(
    template: string,
    args: any,
    context: Map<string, any>,
    env: CountryEnvironmentModel,
  ): Promise<string> {
    const componentReady: EventEmitter<any> = new EventEmitter<any>();

    try {
      const component = getComponentFromTemplate(template);
      const componentRef = this.viewContainerRef.createComponent(component);

      // Give a hard timeout of 5s and force clear the component in case this function freezes.
      setTimeout(() => {
        this.viewContainerRef.clear();
      }, 5_000);

      componentRef.setInput('strUtils', StringUtils);
      componentRef.setInput('componentReady', componentReady);
      componentRef.setInput('args', args);
      componentRef.setInput('context', context);
      componentRef.setInput('env', env);

      //TODO: consider treating this or something here as a flag if the compilation went well
      // This also will freeze if there is a problem with the template
      await firstValueFrom(componentReady);

      return componentRef.location.nativeElement.innerText;
    } finally {
      // This is necessary since if the component has invalid content, it will keep failing as
      // the current viewContainerRef is the appRoot, so this component is always refreshed.
      this.viewContainerRef.clear();
    }
  }
}

function getComponentFromTemplate(template: string): any {
  const className = StringUtils.generateRandomClassName();
  const classDefinition = `
  return class ${className} {
    _templateProcesses = null;
    valuesPerInd = {};
    promisesPerInd = {};

    constructor() {}

    // Because angular templates make tens of calls for the same interpolation, an index
    // is required to first ensure you don't get new random val on each call and second
    // when using async, you MUST return only one promise, otherwise if spikes to CPU 100%
    getRandomStr(ind) {
      if (!this.valuesPerInd[ind]) {
        this.valuesPerInd[ind] = this.strUtils.getUniqueStr();
        this.promisesPerInd[ind] = new Promise((res, rej) => {
          setTimeout(() => {
            res(this.valuesPerInd[ind]);
          }, 1500);
        });
      }
      return this.promisesPerInd[ind];
    }

    ngOnInit() {
    }

    makeArray(val) {
      return [].constructor(val);
    }

    ofNum(val) {
      return Number(val);
    }

    ngAfterViewChecked() {
      if (!this._templateProcesses) {
        this._templateProcesses = Promise.allSettled(Object.values(this.promisesPerInd));
        this._templateProcesses.then(() => {
          setTimeout(() => {this.componentReady.next('all settled');}, 100)
        });
      }
    }
  }
`;

  const MyCustomComponent = new Function(classDefinition)();

  ɵcompileComponent(MyCustomComponent, {
    template,
    selector: StringUtils.generateRandomClassName(),
    standalone: true,
    imports: [NgFor, NgIf, AsyncPipe],
    interpolation: ['[%', '%]'],
    inputs: [
      {
        name: 'strUtils',
      },
      {
        name: 'componentReady',
      },
      {
        name: 'args',
      },
      {
        name: 'env',
      },
      {
        name: 'context',
      },
      {
        name: 'dialogService',
      },
    ],
  });

  return MyCustomComponent;
}
