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

@Component({
  selector: 'app-add-env-dialog',
  standalone: true,
  imports: [NgIf, CopyIconComponent, EnvFormComponent],
  templateUrl: './add-env-dialog.component.html',
  styleUrl: './add-env-dialog.component.scss',
})
export class AddEnvDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
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
    const res = await this.envService.createEnv(environmentPayload);

    if (res.isSuccess) {
      this.close(true);
      return;
    }

    alert('There were some errors, check the console!');
    console.log(res);
  }
}
