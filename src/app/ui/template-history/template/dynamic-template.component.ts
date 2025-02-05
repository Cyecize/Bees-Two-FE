import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
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
  template: `
    <div style="max-height: 100px; overflow-y: auto">
      <ng-template #dynamicContainer></ng-template>
    </div>
    <pre><code style="overflow-y: auto">{{ payloadPreview }}</code></pre>
  `,
  standalone: true,
})
export class DynamicTemplateComponent implements OnInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  @Input()
  template!: RequestTemplateView;

  @Input()
  env!: CountryEnvironmentModel;

  payloadPreview: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.template) {
      return;
    }

    const encodedTemplate = RequestTemplateUtil.encodePayload(
      this.template.payloadTemplate,
    );

    if (encodedTemplate) {
      await this.compileTemplate(encodedTemplate);
    }
  }

  private async compileTemplate(template: string): Promise<void> {
    const componentReady: EventEmitter<any> = new EventEmitter<any>();
    const args = await this.retrieveArguments();
    console.info('Using arguments', args);

    const component = getComponentFromTemplate(template);
    const componentRef = this.dynamicContainer.createComponent(component);
    componentRef.setInput('strUtils', StringUtils);
    componentRef.setInput('componentReady', componentReady);
    componentRef.setInput('arguments', args);

    componentReady.subscribe((val) => {
      console.log(val);

      // Log the inner HTML of the dynamically created component
      const innerHTML = componentRef.location.nativeElement.innerText;
      console.log(
        (this.payloadPreview = JSON.stringify(JSON.parse(innerHTML), null, 2)),
      );
    });
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
    ],
  });

  return MyCustomComponent;
}
