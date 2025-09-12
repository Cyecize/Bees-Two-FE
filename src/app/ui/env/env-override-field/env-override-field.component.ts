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
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-env-override-field',
  standalone: true,
  imports: [SelectSearchComponent, ReactiveFormsModule],
  templateUrl: './env-override-field.component.html',
  styleUrl: './env-override-field.component.scss',
})
export class EnvOverrideFieldComponent implements OnInit {
  private allEnvs: CountryEnvironmentModel[] = [];
  private globallySelectedEnv!: CountryEnvironmentModel;

  environments: Page<SelectSearchItem<CountryEnvironmentModel>> =
    new EmptyPage();

  selectedEnv?: CountryEnvironmentModel;
  textToDisplay = '';

  constructor(
    private envService: CountryEnvironmentService,
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.allEnvs = await this.envService.getEnvs();

    this.onEnvSearch('');

    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.globallySelectedEnv = value;
        this.envOverrideService.setEnv(value);
      }
    });

    this.envOverrideService.envOverride$.subscribe((value) => {
      this.selectedEnv = value;
      this.textToDisplay = value?.envName || '';
    });
  }

  envSelected(env: SelectSearchItem<CountryEnvironmentModel>): void {
    if (env.objRef) {
      this.envOverrideService.setEnv(env.objRef);
    }
  }

  onEnvSearch(needle: string): void {
    let envsToUse = this.allEnvs;

    if (needle?.length) {
      // Convert wildcard pattern to regex
      const pattern = needle
        .split('%') // Split by wildcard
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape regex special chars
        .join('.*'); // Join with regex wildcard

      const regex = new RegExp(pattern, 'i'); // Case-insensitive
      envsToUse = envsToUse.filter((e) => regex.test(e.envName));
    }

    this.environments = new PageImpl(
      envsToUse.map(
        (env) => new SelectSearchItemImpl(env.envName, env.id, env),
      ),
    );
  }

  onChange(val: any): void {
    if (!val?.trim()?.length && this.globallySelectedEnv) {
      console.info(
        'User cleared env override search field, going back to globally selected env!',
      );

      this.textToDisplay = '';
      setTimeout(
        () => (this.textToDisplay = this.globallySelectedEnv.envName),
        1,
      );
      this.envOverrideService.setEnv(this.globallySelectedEnv);
    }
  }

  async openEnvSelector(): Promise<void> {
    const envs = await this.dialogService.openEnvPickerMultiselect();
    if (envs.length !== 1) {
      console.info(
        'Ignoring env picker since user did not select exactly 1 environment.',
      );
      return;
    }

    this.envOverrideService.setEnv(envs[0]);
  }
}
