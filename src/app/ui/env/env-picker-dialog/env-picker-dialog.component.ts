import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import {firstValueFrom, Observable} from 'rxjs';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-env-picker-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './env-picker-dialog.component.html',
  styleUrl: './env-picker-dialog.component.scss',
})
export class EnvPickerDialogComponent
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  currentEnv!: CountryEnvironmentModel;
  envs: CountryEnvironmentModel[] = [];

  constructor(private envService: CountryEnvironmentService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Choose Environment');
    this.envService.selectedEnv$.subscribe((value) => {
      if (value) {
        this.currentEnv = value;
      }
    });

    this.envs = await firstValueFrom(this.envService.getAllEnvs());
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  selectEnv(env: CountryEnvironmentModel): void {
    this.envService.selectEnv(env);
  }
}
