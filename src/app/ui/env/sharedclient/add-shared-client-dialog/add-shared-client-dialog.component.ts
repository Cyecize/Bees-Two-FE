import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../../shared/components/copy-icon/copy-icon.component';
import { EnvFormComponent } from '../../env-form/env-form.component';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { SharedClientService } from '../../../../api/env/sharedclient/shared-client.service';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { SharedClientPayload } from '../../../../api/env/sharedclient/shared-client.payload';
import { FieldError } from '../../../../shared/field-error/field-error';
import { SharedClientFormComponent } from '../shared-client-form/shared-client-form.component';

@Component({
  selector: 'app-add-shared-client-dialog',
  standalone: true,
  imports: [
    NgIf,
    CopyIconComponent,
    EnvFormComponent,
    SharedClientFormComponent,
  ],
  templateUrl: './add-shared-client-dialog.component.html',
  styleUrl: './add-shared-client-dialog.component.scss',
})
export class AddSharedClientDialogComponent
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  errors: FieldError[] = [];

  constructor(private sharedClientService: SharedClientService) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  ngOnInit(): void {}

  @ShowLoader()
  async onFormSubmit(environmentPayload: SharedClientPayload): Promise<void> {
    this.errors = [];
    const res = await this.sharedClientService.create(environmentPayload);

    this.errors = res.errors;

    if (res.isSuccess) {
      this.close(true);
      return;
    }
  }
}
