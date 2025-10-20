import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { TemplateArgPromptDialogPayload } from './template-arg-prompt-dialog.payload';
import { Observable } from 'rxjs';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { TemplateArgsPromptDialogResponse } from './template-args-prompt-dialog.response';
import { NgIf } from '@angular/common';
import { TemplateArgInputType } from '../../../../api/template/arg/template-arg-input.type';

@Component({
  standalone: true,
  templateUrl: './template-arg-prompt-dialog.component.html',
  imports: [InputComponent, FormsModule, NgIf],
})
export class TemplateArgPromptDialogComponent
  extends DialogContentBaseComponent<TemplateArgPromptDialogPayload>
  implements OnInit
{
  value: any;

  ngOnInit(): void {
    this.setTitle('Provide value');
    if (this.payload.prefillExistingValue) {
      this.value = this.payload.arg.value;
    }

    if (this.payload.textarea === null) {
      this.payload.textarea =
        this.payload.arg.inputType === TemplateArgInputType.TEXTAREA;
    }
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  saveAndClose(): void {
    this.finalSaveAndClose(this.value);
  }

  saveAsNull(): void {
    this.finalSaveAndClose(null);
  }

  private finalSaveAndClose(value: any): void {
    if (this.payload.updateArg) {
      this.payload.arg.value = value;
    }
    super.close(new TemplateArgsPromptDialogResponse(value));
  }
}
