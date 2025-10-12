import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../dialog-content-base.component';
import { Observable } from 'rxjs';
import { ObjDiffDialogPayload } from './obj-diff-dialog-payload.model';
import { NgxObjectDiffService } from '../../../components/ngx-obj-diff/ngx-obj-diff.service';
import { NgxObjectDiffComponent } from '../../../components/ngx-obj-diff/ngx-obj-diff.component';

@Component({
  standalone: true,
  template: `
    <div class="dialog-content-container">
      <div class="p-2" style="max-height: 450px; overflow-y: auto">
        <app-ngx-object-diff [obj]="object1View"></app-ngx-object-diff>
        <app-ngx-object-diff [obj]="object2View"></app-ngx-object-diff>
        <app-ngx-object-diff [obj]="diffView"></app-ngx-object-diff>
        <app-ngx-object-diff [obj]="diffValueChanges"></app-ngx-object-diff>
      </div>

      <div class="d-flex flex-wrap justify-content-end">
        <div class="p-2">
          <button (click)="close(false)" class="btn">Close</button>
        </div>
        <div class="p-2">
          <!--          <button class="btn btn-success" (click)="copy()">Copy</button>-->
        </div>
      </div>
    </div>
  `,
  imports: [NgxObjectDiffComponent],
})
export class ObjDiffDialogComponent
  extends DialogContentBaseComponent<ObjDiffDialogPayload>
  implements OnInit
{
  object1View: any;
  object2View: any;
  diffView: any;
  diffValueChanges: any;

  constructor(private objectDiff: NgxObjectDiffService) {
    super();
  }

  ngOnInit(): void {
    this.object1View = this.objectDiff.objToJsonView(this.payload.obj1);
    this.object2View = this.objectDiff.objToJsonView(this.payload.obj2);

    // you can directly diff your objects js now or parse a Json to object and diff
    const diff = this.objectDiff.diff(this.payload.obj2, this.payload.obj1);
    // you can directly diff your objects including prototype properties and inherited properties using `diff` method

    // gives a full object view with Diff highlighted
    this.diffView = this.objectDiff.toJsonView(diff);
    // gives object view with only Diff highlighted
    this.diffValueChanges = this.objectDiff.toJsonDiffView(diff);
  }

  getIcon(): Observable<string> {
    return this.compareIcon();
  }
}
