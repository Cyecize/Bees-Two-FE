import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { CreatePresetDialogPayload } from './create-preset-dialog.payload';
import { Observable } from 'rxjs';
import { PresetFormComponent } from '../preset-form/preset-form.component';
import { CreateRequestTemplatePreset } from '../../../../api/template/arg/preset/create-request-template-preset';
import { FieldError } from '../../../../shared/field-error/field-error';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { RequestTemplatePresetService } from '../../../../api/template/arg/preset/request-template-preset.service';

@Component({
  selector: 'app-create-preset-dialog',
  standalone: true,
  imports: [PresetFormComponent],
  templateUrl: './create-preset-dialog.component.html',
  styleUrl: './create-preset-dialog.component.scss',
})
export class CreatePresetDialogComponent
  extends DialogContentBaseComponent<CreatePresetDialogPayload>
  implements OnInit
{
  errors: FieldError[] = [];

  constructor(
    private requestTemplatePresetService: RequestTemplatePresetService,
  ) {
    super();
  }

  ngOnInit(): void {}

  override getIcon(): Observable<string> {
    return super.gearIcon();
  }

  @ShowLoader()
  protected async onFormSubmit(
    payload: CreateRequestTemplatePreset,
  ): Promise<void> {
    this.errors = [];

    const resp = await this.requestTemplatePresetService.createPreset(payload);
    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.close(true);
    }
  }
}
