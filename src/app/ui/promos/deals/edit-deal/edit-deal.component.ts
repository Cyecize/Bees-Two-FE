import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { DealsFormComponent } from '../deals-form/deals-form.component';
import { CreateDealsPayload } from '../../../../api/deals/payloads/create-deals.payload';
import { DealsService } from '../../../../api/deals/deals.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { RouteNavigator } from '../../../../shared/routing/route-navigator.service';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { AppRoutingPath } from '../../../../app-routing.path';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import {
  DealsSearchQuery,
  DealsSearchQueryImpl,
} from '../../../../api/deals/payloads/deals-search.query';
import { Deal } from '../../../../api/deals/deal';

@Component({
  selector: 'app-edit-deal',
  standalone: true,
  imports: [DealsFormComponent],
  templateUrl: './edit-deal.component.html',
  styleUrl: './edit-deal.component.scss',
})
export class EditDealComponent implements OnInit, OnDestroy {
  private envOverride!: CountryEnvironmentModel;
  private envSub!: Subscription;

  deals: Deal[] = [];
  query!: DealsSearchQuery;

  constructor(
    private dealService: DealsService,
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private envService: CountryEnvironmentService,
    private nav: RouteNavigator,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    const envId = Number(this.route.snapshot.params['envId']);
    const vendorDealId = this.route.snapshot.params['vendorDealId'] as string;

    const env = await this.envService.findById(envId);
    if (!env) {
      console.warn(`No env found with id ${envId}!`);
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

    this.envOverrideService.setEnv(env);

    if (
      !(await this.loadDeal(vendorDealId, env, this.route.snapshot.queryParams))
    ) {
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

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

  @ShowLoader()
  private async loadDeal(
    vendorDealId: string,
    env: CountryEnvironmentModel,
    queryParams: any,
  ): Promise<boolean> {
    this.query = DealsSearchQueryImpl.fromEditRouteParams(queryParams);

    this.query.body.vendorId = env.vendorId;
    this.query.body.vendorDealId = vendorDealId;

    const result = await this.dealService.searchDeals(this.query, env);

    if (!result.isSuccess || !result.response.response) {
      alert('Could not load or find deal!');
      return false;
    }

    this.deals = result.response.response.deals;
    return true;
  }
}

export const EDIT_DEALS_ROUTES: Routes = [
  {
    path: '',
    component: EditDealComponent,
  },
];
