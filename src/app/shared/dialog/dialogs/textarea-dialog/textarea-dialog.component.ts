import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../dialog-content-base.component';
import { TextareaDialogPayload } from './textarea-dialog.payload';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TextareaDialogResponse } from './textarea-dialog.response';

@Component({
  standalone: true,
  templateUrl: './textarea-dialog.component.html',
  imports: [FormsModule],
})
export class TextareaDialogComponent
  extends DialogContentBaseComponent<TextareaDialogPayload>
  implements OnInit
{
  value: any;

  ngOnInit(): void {
    this.value = this.payload.existingText;
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  saveAndClose(): void {
    super.close(new TextareaDialogResponse(this.value));
  }

  saveAsNull(): void {
    super.close(new TextareaDialogResponse(null));
  }
}
