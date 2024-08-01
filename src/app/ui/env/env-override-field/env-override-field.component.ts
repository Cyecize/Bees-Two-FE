import { Component, OnInit } from '@angular/core';
import { SelectSearchComponent } from '../../../shared/form-controls/select-search/select-search.component';
import { EmptyPage, Page, PageImpl } from '../../../shared/util/page';
import {
  SelectSearchItem,
  SelectSearchItemImpl,
} from '../../../shared/form-controls/select-search/select-search.item';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';

@Component({
  selector: 'app-env-override-field',
  standalone: true,
  imports: [SelectSearchComponent],
  templateUrl: './env-override-field.component.html',
  styleUrl: './env-override-field.component.scss',
})
export class EnvOverrideFieldComponent implements OnInit {
  environments: Page<SelectSearchItem<CountryEnvironmentModel>> =
    new EmptyPage();
  selectedEnv?: CountryEnvironmentModel;

  constructor(
    private envService: CountryEnvironmentService,
    private envOverrideService: EnvOverrideService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.environments = new PageImpl(
      (await this.envService.getEnvs()).map(
        (env) => new SelectSearchItemImpl(env.envName, env.id, env),
      ),
    );

    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.envOverrideService.setEnv(value);
      }
    });

    this.envOverrideService.envOverride$.subscribe(
      (value) => (this.selectedEnv = value),
    );
  }

  envSelected(env: SelectSearchItem<CountryEnvironmentModel>): void {
    if (env.objRef) {
      this.envOverrideService.setEnv(env.objRef);
    }
  }
}
