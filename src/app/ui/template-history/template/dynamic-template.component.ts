import {
  AfterViewInit,
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

// This is required in order to retain the angular compiler import as production build removes unneeded imports
// The import is needed to be present in order to dynamically compile, but not actually used in this component
const compilerImport = angularCompiler;

@Component({
  selector: 'app-dynamic-template',
  template: `<ng-template #dynamicContainer></ng-template>
    <pre><code>{{ payloadPreview }}</code></pre> `,
  standalone: true,
})
export class DynamicTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  @Input()
  data!: RequestTemplateView;

  payloadPreview: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.data) {
      const encodedTemplate = RequestTemplateUtil.encodePayload(
        this.data.payloadTemplate,
      );

      if (encodedTemplate) {
        this.compileTemplate(encodedTemplate);
      }
    }
  }

  ngAfterViewInit(): void {
    // this.cdr.detectChanges(); // Ensure change detection runs
  }

  private compileTemplate(template: string): void {
    const componentReady: EventEmitter<any> = new EventEmitter<any>();

    const component = getComponentFromTemplate(template);
    const componentRef = this.dynamicContainer.createComponent(component);
    componentRef.setInput('name', StringUtils.getUniqueStr());
    componentRef.setInput('age', 26);
    componentRef.setInput('strUtils', StringUtils);
    componentRef.setInput('componentReady', componentReady);

    componentReady.subscribe((val) => {
      console.log(val);

      // Log the inner HTML of the dynamically created component
      const innerHTML = componentRef.location.nativeElement.innerText;
      console.log(
        (this.payloadPreview = JSON.stringify(JSON.parse(innerHTML), null, 2)),
      );
    });
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

    ngOnInit() {}

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
    interpolation: ['%%', '%%'],
    inputs: [
      {
        name: 'name',
      },
      {
        name: 'age',
      },
      {
        name: 'strUtils',
      },
      {
        name: 'componentReady',
      },
    ],
  });

  return MyCustomComponent;
}
