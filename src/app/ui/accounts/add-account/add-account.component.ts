import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountV2Payload } from '../../../api/accounts/v2/account-v2.payload';
import { AccountV2Service } from '../../../api/accounts/v2/account-v2.service';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss',
})
export class AddAccountComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  rawJson = '';

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private accountV2Service: AccountV2Service,
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

  async onRawFormSubmit(): Promise<void> {
    let data: AccountV2Payload;
    try {
      data = JSON.parse(this.rawJson) as AccountV2Payload;
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    const res = await this.accountV2Service.ingest(data, this.envOverride);

    console.log(res);
    if (!res.isSuccess) {
      this.dialogService.openRequestResultDialog(res);
    }
  }
}

export const ADD_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AddAccountComponent,
  },
];
