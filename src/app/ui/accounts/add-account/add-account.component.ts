import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { AccountV1Service } from '../../../api/accounts/v1/account-v1.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideFieldComponent } from "../../env/env-override-field/env-override-field.component";
import { InputComponent } from "../../../shared/form-controls/input/input.component";

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [EnvOverrideFieldComponent, InputComponent],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss',
})
export class AddAccountComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private accountV1Service: AccountV1Service,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      // this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }
}

export const ADD_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AddAccountComponent,
  },
];
