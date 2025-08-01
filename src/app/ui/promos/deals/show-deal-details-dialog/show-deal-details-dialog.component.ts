import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowDealDetailsDialogPayload } from './show-deal-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { DealsService } from '../../../../api/deals/deals.service';
import { DeleteSingleVendorDealIdPayload } from '../../../../api/deals/payloads/delete-deals.payload';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { RouteUtils } from '../../../../shared/routing/route-utils';
import { AppRoutingPath } from '../../../../app-routing.path';
import { PlatformIdService } from '../../../../api/platformid/platform-id.service';

@Component({
  selector: 'app-show-reward-setting-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-deal-details-dialog.component.html',
  styleUrl: './show-deal-details-dialog.component.scss',
})
export class ShowDealDetailsDialogComponent
  extends DialogContentBaseComponent<ShowDealDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  editRoute!: string;
  editRouteQueryParams: any = {};

  constructor(
    private dialogService: DialogService,
    private dealsService: DealsService,
    private envService: CountryEnvironmentService,
    private platformIdService: PlatformIdService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.dataJson = JSON.stringify(this.payload.deal, null, 2);
    await this.setEditRoute();
  }

  async setEditRoute(): Promise<void> {
    this.editRoute = RouteUtils.setPathParams(
      AppRoutingPath.EDIT_DEAL.toString(),
      {
        vendorDealId: this.payload.deal.vendorDealId,
        envId: this.payload.selectedEnv.id,
      },
    );

    this.editRouteQueryParams = this.payload.query.toEditRouteQueryParams();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    this.dialogService
      .openConfirmDialog(
        `You are about to delete a deal with id ${this.payload.deal.vendorDealId}`,
        'Delete deal!',
        'Delete',
      )
      .subscribe(async (confirm) => {
        if (confirm) {
          // @ts-ignore
          const env: CountryEnvironmentModel =
            this.payload.selectedEnv || this.envService.getCurrentEnv();
          const result = await this.dealsService.deleteDeals(
            new DeleteSingleVendorDealIdPayload(this.payload.deal.vendorDealId),
            env,
          );

          if (result.isSuccess) {
            alert('Deal was deleted!');
            this.close(null);
          } else {
            this.dialogService.openRequestResultDialog(result);
          }
        }
      });
  }
}
