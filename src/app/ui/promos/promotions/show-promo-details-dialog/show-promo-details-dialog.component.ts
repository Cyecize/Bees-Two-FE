import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowPromoDetailsDialogPayload } from './show-promo-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { PlatformIdService } from '../../../../api/platformid/platform-id.service';
import { PromoService } from '../../../../api/promo/promo.service';

@Component({
  selector: 'app-show-promo-details-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-promo-details-dialog.component.html',
  styleUrl: './show-promo-details-dialog.component.scss',
})
export class ShowPromoDetailsDialogComponent
  extends DialogContentBaseComponent<ShowPromoDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  editRoute!: string;

  constructor(
    private dialogService: DialogService,
    private promoService: PromoService,
    private envService: CountryEnvironmentService,
    private platformIdService: PlatformIdService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.dataJson = JSON.stringify(this.payload.promo, null, 2);
    await this.setEditRoute();
  }

  async setEditRoute(): Promise<void> {
    this.editRoute = '/TODO';
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
        `You are about to delete a promo with id ${this.payload.promo.vendorUniqueIds.vendorPromotionId}`,
        'Delete promo!',
        'Delete',
      )
      .subscribe(async (confirm) => {
        if (confirm) {
          const resp = await this.promoService.deletePromo(this.payload.promo);
          alert('Promo was deleted successfully.');
          super.close(true);
        }
      });
  }
}
