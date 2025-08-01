import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Observable } from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../shared/components/copy-icon/copy-icon.component';
import { EnvFormComponent } from '../env-form/env-form.component';
import { CountryEnvironmentPayload } from '../../../api/env/country-environment.payload';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { FieldError } from '../../../shared/field-error/field-error';

@Component({
  selector: 'app-edit-env-dialog',
  standalone: true,
  imports: [NgIf, CopyIconComponent, EnvFormComponent],
  templateUrl: './edit-env-dialog.component.html',
  styleUrl: './edit-env-dialog.component.scss',
})
export class EditEnvDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  errors: FieldError[] = [];

  constructor(private envService: CountryEnvironmentService) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  ngOnInit(): void {}

  @ShowLoader()
  async onFormSubmit(
    environmentPayload: CountryEnvironmentPayload,
  ): Promise<void> {
    const res = await this.envService.update(
      this.payload.id,
      environmentPayload,
    );

    this.errors = res.errors;

    if (res.isSuccess) {
      this.close(true);
      return;
    }

    alert('There were some errors, check the console!');
    console.log(res);
  }
}
