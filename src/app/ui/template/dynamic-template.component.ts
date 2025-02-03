import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ɵcompileComponent,
} from '@angular/core';
import * as angularCompiler from '@angular/compiler';
import { NgFor } from '@angular/common';

// This is required in order to retain the angular compiler import as production build removes unneeded imports
// The import is needed to be present in order to dynamically compile, but not actually used in this component
const compilerImport = angularCompiler;

@Component({
  selector: 'app-dynamic-template',
  template: ' <ng-template #dynamicContainer></ng-template>',
  standalone: true,
})
export class DynamicTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.compileTemplate('My name is {{name}}');
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Ensure change detection runs
  }

  private compileTemplate(template: string): void {
    const component = getComponentFromTemplate(template);
    const componentRef =
      this.dynamicContainer.createComponent<MyCustomComponent>(component);
    componentRef.setInput('name', 'Genadi!');
    // this.cdr.detectChanges(); // Ensure change detection runs

    // Wait for the next change detection cycle to get the rendered HTML
    // setTimeout(() => {
    //   const componentHtml = componentRef.location.nativeElement.innerHTML;
    //   console.log('Dynamic Component HTML:', componentHtml);
    // });
  }
}

@Component({
  template: '',
  standalone: true,
})
class MyCustomComponent {}

function getComponentFromTemplate(template: string): any {
  ɵcompileComponent(MyCustomComponent, {
    template,
    standalone: true,
    imports: [NgFor],
    inputs: [
      {
        name: 'name',
      },
    ],
  });

  return MyCustomComponent;
}
