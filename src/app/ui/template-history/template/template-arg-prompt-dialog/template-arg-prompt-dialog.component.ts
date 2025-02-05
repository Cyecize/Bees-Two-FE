import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { TemplateArgPromptDialogPayload } from './template-arg-prompt-dialog.payload';
import { Observable } from 'rxjs';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { TemplateArgsPromptDialogResponse } from './template-args-prompt-dialog.response';
import { NgIf } from '@angular/common';

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
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  saveAndClose(): void {
    super.close(new TemplateArgsPromptDialogResponse(this.value));
  }

  saveAsNull(): void {
    super.close(new TemplateArgsPromptDialogResponse(null));
  }
}
