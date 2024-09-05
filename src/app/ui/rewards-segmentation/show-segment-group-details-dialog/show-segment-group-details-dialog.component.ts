import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowSegmentGroupDetailsDialogPayload } from './show-segment-group-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';

@Component({
  selector: 'app-show-segment-group-details-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-segment-group-details-dialog.component.html',
  styleUrl: './show-segment-group-details-dialog.component.scss',
})
export class ShowSegmentGroupDetailsDialogComponent
  extends DialogContentBaseComponent<ShowSegmentGroupDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  editRoute!: string;

  constructor(
    private dialogService: DialogService,
    private segmentationService: SegmentationService,
    private envService: CountryEnvironmentService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.dataJson = JSON.stringify(this.payload.group, null, 2);
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    alert('del!');
    // this.dialogService
    //   .openConfirmDialog(
    //     `You are about to delete a deal with id ${this.payload.deal.vendorDealId}`,
    //     'Delete deal!',
    //     'Delete',
    //   )
    //   .subscribe(async (confirm) => {
    //     if (confirm) {
    //       // @ts-ignore
    //       const env: CountryEnvironmentModel =
    //         this.payload.selectedEnv || this.envService.getCurrentEnv();
    //       const result = await this.dealsService.deleteDeals(
    //         new DeleteSingleVendorDealIdPayload(this.payload.deal.vendorDealId),
    //         env,
    //       );
    //
    //       if (result.isSuccess) {
    //         alert('Deal was deleted!');
    //         this.close(null);
    //       } else {
    //         this.dialogService.openRequestResultDialog(result);
    //       }
    //     }
    //   });
  }
}
