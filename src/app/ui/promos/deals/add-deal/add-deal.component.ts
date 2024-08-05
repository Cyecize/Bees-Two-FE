import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DealsFormComponent } from '../deals-form/deals-form.component';
import { CreateDealsPayload } from '../../../../api/deals/payloads/create-deals.payload';
import { DealsService } from '../../../../api/deals/deals.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-deal',
  standalone: true,
  imports: [DealsFormComponent],
  templateUrl: './add-deal.component.html',
  styleUrl: './add-deal.component.scss',
})
export class AddDealComponent implements OnInit, OnDestroy {
  private envOverride!: CountryEnvironmentModel;
  private envSub!: Subscription;

  constructor(
    private dealService: DealsService,
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (value) {
        this.envOverride = value;
      }
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async onFormSubmit(form: CreateDealsPayload): Promise<void> {
    if (!this.envOverride) {
      alert('Env selection is required!');
    }

    this.dialogService
      .openConfirmDialog(
        `Do you want to proceed with sending request to ${this.envOverride.envName}`,
      )
      .subscribe(async (confirmed) => {
        if (!confirmed) {
          return;
        }
        const res = await this.dealService.createDeals(form, this.envOverride);
        this.dialogService.openRequestResultDialog(res);
      });
  }
}

export const ADD_DEALS_ROUTES: Routes = [
  {
    path: '',
    component: AddDealComponent,
  },
];
