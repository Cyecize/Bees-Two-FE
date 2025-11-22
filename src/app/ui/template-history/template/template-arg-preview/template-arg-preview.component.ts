import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  RequestTemplateArg,
  RequestTemplateArgView,
} from '../../../../api/template/arg/request-template-arg';
import { NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { TemplateArgDataType } from '../../../../api/template/arg/template-arg-data.type';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';

@Component({
  selector: 'app-template-arg-preview',
  standalone: true,
  imports: [TooltipSpanComponent, NgIf],
  templateUrl: './template-arg-preview.component.html',
  styleUrl: './template-arg-preview.component.scss',
})
export class TemplateArgPreviewComponent implements OnInit {
  protected readonly TemplateArgDataType = TemplateArgDataType;

  @Input()
  args: RequestTemplateArgView[] = [];

  @Input()
  enableEdits = false;

  updatedArgs: RequestTemplateArgView[] = [];

  @Output()
  argsUpdated = new EventEmitter<RequestTemplateArgView[]>();

  constructor(
    private dialogService: DialogService,
    private environmentService: CountryEnvironmentService,
  ) {}

  ngOnInit(): void {}

  protected showFull(arg: RequestTemplateArg): void {
    this.dialogService.openShowCodeDialog(
      ObjectUtils.formatIfJson(arg.value),
      `Value for arg: ${arg.name}`,
    );
  }

  protected viewArgType(arg: RequestTemplateArg): void {
    this.dialogService.openShowCodeDialog(
      ObjectUtils.formatIfJson(arg.customType),
      'View custom arg type!',
    );
  }

  protected async openEditPrompt(arg: RequestTemplateArgView): Promise<void> {
    arg = JSON.parse(JSON.stringify(arg));
    arg.value = await this.dialogService.openTemplateArgPrompt(
      this.environmentService.getCurrentEnv()!,
      arg,
      undefined,
      true,
    );

    this.updatedArgs = this.updatedArgs.filter((a) => a.id !== arg.id);
    this.updatedArgs.push(arg);

    this.argsUpdated.emit(this.updatedArgs);
  }
}
