import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ɵcompileComponent,
} from '@angular/core';
import * as angularCompiler from '@angular/compiler';
import { NgFor, NgIf } from '@angular/common';
import { StringUtils } from '../../../shared/util/string-utils';
import { RequestTemplateView } from '../../../api/template/request-template';
import { RequestTemplateUtil } from '../../../api/template/request-template.util';

// This is required in order to retain the angular compiler import as production build removes unneeded imports
// The import is needed to be present in order to dynamically compile, but not actually used in this component
const compilerImport = angularCompiler;

@Component({
  selector: 'app-dynamic-template',
  template:
    ' <pre><code><ng-template #dynamicContainer></ng-template></code></pre>',
  standalone: true,
})
export class DynamicTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  @Input()
  data!: RequestTemplateView;

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
    const component = getComponentFromTemplate(template);
    const componentRef = this.dynamicContainer.createComponent(component);
    componentRef.setInput('name', StringUtils.getUniqueStr());
    componentRef.setInput('age', 26);
    componentRef.setInput('strUtils', StringUtils);
    // this.cdr.detectChanges(); // Ensure change detection runs

    // Wait for the next change detection cycle to get the rendered HTML
    // setTimeout(() => {
    //   const componentHtml = componentRef.location.nativeElement.innerHTML;
    //   console.log('Dynamic Component HTML:', componentHtml);
    // });
  }
}

function getComponentFromTemplate(template: string): any {
  const className = StringUtils.generateRandomClassName();
  const classDefinition = `
  return class ${className} {

    valuesPerInd = {};

    constructor() {
    }

    getRandomStr(ind) {
    if (this.valuesPerInd[ind]) {
       return this.valuesPerInd[ind];
    }

    this.valuesPerInd[ind] = this.strUtils.getUniqueStr();
    return this.getRandomStr(ind);
    }

    ngOnInit() {

    }

  }
`;

  const MyCustomComponent = new Function(classDefinition)();

  ɵcompileComponent(MyCustomComponent, {
    template,
    selector: StringUtils.generateRandomClassName(),
    standalone: true,

    imports: [NgFor, NgIf],
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
    ],
  });

  return MyCustomComponent;
}
