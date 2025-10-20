import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowSegmentGroupByAccountDetailsDialogPayload } from './show-segment-group-by-account-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { CountryEnvironmentService } from '../../../api/env/country-environment.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-show-segment-group-by-account-details-dialog',
  standalone: true,
  imports: [RouterLink, NgForOf],
  templateUrl: './show-segment-group-by-account-details-dialog.component.html',
  styleUrl: './show-segment-group-by-account-details-dialog.component.scss',
})
export class ShowSegmentGroupByAccountDetailsDialogComponent
  extends DialogContentBaseComponent<ShowSegmentGroupByAccountDetailsDialogPayload>
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
    void navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    this.dialogService
      .openConfirmDialog(
        `You are about to delete an account group with account id ${this.payload.group.accountId}`,
        'Delete account group!',
        'Delete',
      )
      .subscribe(async (confirm) => {
        if (confirm) {
          this.dialogService
            .openBeesTokenOverrideDialog(this.payload.selectedEnv)
            .subscribe(async (token) => {
              if (!token) {
                alert('Please select a token in order to proceed!');
                return;
              }

              const result = await this.segmentationService.deleteAccountGroup(
                this.payload.group.accountId,
                token.token,
                this.payload.selectedEnv,
              );

              if (result.isSuccess) {
                alert('Account Group was deleted!');
                this.close(true);
              } else {
                this.dialogService.openRequestResultDialog(result);
              }
            });
        }
      });
  }

  unassignGroup(groupId: string): void {
    this.dialogService
      .openConfirmDialog(
        `You are about to unassign group ${groupId} from account group with account id ${this.payload.group.accountId}`,
        'Unassign group from account!',
        'Unassign',
      )
      .subscribe(async (confirm) => {
        if (!confirm) {
          return;
        }

        this.dialogService
          .openBeesTokenOverrideDialog(this.payload.selectedEnv)
          .subscribe(async (token) => {
            if (!token) {
              alert('Please select a token in order to proceed!');
              return;
            }

            const result =
              await this.segmentationService.deleteAccountGroupGroup(
                this.payload.group.accountId,
                groupId,
                token.token,
                this.payload.selectedEnv,
              );

            if (result.isSuccess) {
              alert('Group was unassigned!');
              this.payload.group = (
                await this.segmentationService.getAccountGroup(
                  this.payload.group.accountId,
                  this.payload.selectedEnv,
                )
              ).response;
            } else {
              this.dialogService.openRequestResultDialog(result);
            }
          });
      });
  }
}
