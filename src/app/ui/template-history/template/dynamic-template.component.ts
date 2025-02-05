import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  ɵcompileComponent,
} from '@angular/core';
import * as angularCompiler from '@angular/compiler';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { StringUtils } from '../../../shared/util/string-utils';
import { RequestTemplateView } from '../../../api/template/request-template';
import { RequestTemplateUtil } from '../../../api/template/request-template.util';
import { RequestTemplateArgType } from '../../../api/template/arg/request-template-arg.type';
import { RequestTemplateArgView } from '../../../api/template/arg/request-template-arg';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { TemplateArgPromptDialogComponent } from './template-arg-prompt-dialog/template-arg-prompt-dialog.component';
import { TemplateArgPromptDialogPayload } from './template-arg-prompt-dialog/template-arg-prompt-dialog.payload';
import { TemplateArgsPromptDialogResponse } from './template-arg-prompt-dialog/template-args-prompt-dialog.response';

// This is required in order to retain the angular compiler import as production build removes unneeded imports
// The import is needed to be present in order to dynamically compile, but not actually used in this component
const compilerImport = angularCompiler;

@Component({
  selector: 'app-dynamic-template',
  template: '',
  standalone: true,
})
export class DynamicTemplateComponent implements OnInit {
  @Input()
  input!: RequestTemplateView;

  @Input()
  env!: CountryEnvironmentModel;

  private template!: RequestTemplateView;

  @Output()
  processFinished: EventEmitter<RequestTemplateView> =
    new EventEmitter<RequestTemplateView>();

  constructor(
    private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.input) {
      throw new Error('Template is required!');
    }

    // TODO: think of a better deep clone method
    this.template = JSON.parse(JSON.stringify(this.input));

    const args = await this.retrieveArguments();
    console.info('Using arguments', args);

    // TODO: extract the logic for simply compiling template into a service
    // TODO: where user provides inputs like strUtils, etc... as method arg
    const encodedTemplate = RequestTemplateUtil.encodePayload(
      this.template.payloadTemplate,
    );

    if (encodedTemplate) {
      this.template.payloadTemplate = await this.compileTemplate(
        encodedTemplate,
        args,
      );
    }

    if (this.template.endpoint) {
      this.template.endpoint = await this.compileTemplate(this.template.endpoint, args);
    }

    for (const header of this.template.headers) {
      if (header.value) {
        header.value = await this.compileTemplate(header.value + '', args);
      }
    }

    for (const param of this.template.queryParams) {
      if (param.value) {
        param.value = await this.compileTemplate(param.value + '', args);
      }
    }

    this.processFinished.emit(this.template);
  }

  private async compileTemplate(template: string, args: any): Promise<string> {
    const componentReady: EventEmitter<any> = new EventEmitter<any>();

    const component = getComponentFromTemplate(template);
    const componentRef = this.viewContainerRef.createComponent(component);
    componentRef.setInput('strUtils', StringUtils);
    componentRef.setInput('componentReady', componentReady);
    componentRef.setInput('arguments', args);
    componentRef.setInput('env', this.env);

    //TODO: consider treating this or something here as a flag if the compilation went well
    await firstValueFrom(componentReady);
    return componentRef.location.nativeElement.innerText;
  }

  private async retrieveArguments(): Promise<{ [key: string]: string | null }> {
    const ctx: { [key: string]: string | null } = {};
    for (const arg of this.template.arguments) {
      if (arg.type === RequestTemplateArgType.STATIC) {
        ctx[arg.keyName] = arg.value;
      } else if (arg.type === RequestTemplateArgType.PROMPT) {
        ctx[arg.keyName] = await this.promptArg(arg);
      } else {
        throw new Error(`Unsupported arg type ${arg.type}`);
      }
    }
    return ctx;
  }

  private async promptArg(arg: RequestTemplateArgView): Promise<string | null> {
    const resp = (await firstValueFrom(
      this.dialogService
        .open(
          TemplateArgPromptDialogComponent,
          '',
          new TemplateArgPromptDialogPayload(this.env, arg),
        )
        .afterClosed(),
    )) as TemplateArgsPromptDialogResponse;

    if (!resp) {
      return await this.promptArg(arg);
    }

    return resp.value;
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
        name: 'arguments',
      },
      {
        name: 'env',
      },
    ],
  });

  return MyCustomComponent;
}
