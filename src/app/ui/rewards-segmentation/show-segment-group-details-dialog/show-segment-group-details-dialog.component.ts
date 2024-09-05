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
    this.dialogService
      .openConfirmDialog(
        `You are about to delete a group with id ${this.payload.group.id}`,
        'Delete group!',
        'Delete',
      )
      .subscribe(async (confirm) => {
        if (confirm) {
          const result = await this.segmentationService.deleteGroup(
            this.payload.group.id,
            prompt('Enter token from BEES One / Membership!')!,
            this.payload.selectedEnv,
          );

          if (result.isSuccess) {
            alert('Group was deleted!');
            this.close(true);
          } else {
            this.dialogService.openRequestResultDialog(result);
          }
        }
      });
  }
}
