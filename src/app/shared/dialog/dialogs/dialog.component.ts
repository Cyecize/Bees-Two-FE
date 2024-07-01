import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { DialogComponentPayload } from './dialog.component.payload';
import { DialogContentBaseComponent } from './dialog-content-base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  template: `
    <div class="dialog-header">
      <i *ngIf="iconCls" [class]="iconCls"></i>
      <span class="dialog-title">{{ payload.title }}</span>
      <i class="dialog-close fa fa-times" (click)="dialogRef.close()"></i>
    </div>
    <div class="dialog-content">
      <ng-template #placeholder></ng-template>
    </div>
  `,
  imports: [NgIf],
})
export class DialogComponent implements OnInit, AfterViewInit {
  @ViewChild('placeholder', { read: ViewContainerRef })
  private viewRef!: ViewContainerRef;

  payload!: DialogComponentPayload;
  iconCls!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogComponentPayload,
    public dialogRef: MatDialogRef<DialogComponent>,
    private cfr: ComponentFactoryResolver,
  ) {
    this.payload = data;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewRef.clear();
      const componentFactory = this.cfr.resolveComponentFactory(
        this.payload.contentComponentType,
      );
      const dataComponent: ComponentRef<DialogContentBaseComponent<any>> =
        this.viewRef.createComponent(componentFactory);
      dataComponent.instance.payload = this.payload.contentPayload;
      dataComponent.instance.dialogRef = this.dialogRef;
      dataComponent.instance.getIcon().subscribe((val) => (this.iconCls = val));
    });
  }
}
