import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { Observable, Subscription } from 'rxjs';
import { DynamicTemplateComponent } from '../dynamic-template.component';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';

@Component({
  template: ` <div class="dialog-content-container">
    <app-dynamic-template
      [env]="currentEnv"
      [template]="payload"
    ></app-dynamic-template>
  </div>`,
  standalone: true,
  imports: [DynamicTemplateComponent, EnvOverrideFieldComponent],
})
export class PreviewTemplateDialogComponent
  extends DialogContentBaseComponent<RequestTemplateView>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;

  constructor(private envService: CountryEnvironmentService) {
    super();
  }

  ngOnInit(): void {
    this.currentEnv = this.envService.getCurrentEnv()!;
    if (!this.currentEnv) {
      alert('Missing env!');
      super.close(null);
      return;
    }
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }
}
