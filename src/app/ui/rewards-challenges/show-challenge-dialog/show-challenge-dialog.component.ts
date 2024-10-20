import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowChallengeDialogPayload } from './show-challenge-dialog.payload';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { ChallengeService } from '../../../api/rewards/challenges/challenge.service';

@Component({
  selector: 'app-show-challenge-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-challenge-dialog.component.html',
  styleUrl: './show-challenge-dialog.component.scss',
})
export class ShowChallengeDialogComponent
  extends DialogContentBaseComponent<ShowChallengeDialogPayload>
  implements OnInit
{
  dataJson!: string;

  constructor(
    private dialogService: DialogService,
    private challengeService: ChallengeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.challenge, null, 2);
  }

  getEditRoute(): string {
    return 'TODO';
  }

  getEditRawRoute(): string {
    return 'TODO';
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    navigator.clipboard.writeText(this.dataJson);
  }

  cancel(): void {
    this.dialogService
      .openConfirmDialog(
        `You are about to cancel a challenge with id ${this.payload.challenge.id}`,
        'Cancel challenge!',
        'Confirm',
      )
      .subscribe(async (confirm) => {
        if (!confirm) {
          return;
        }

        this.dialogService
          .openBeesTokenOverrideDialog(this.payload.selectedEnv)
          .subscribe(async (token) => {
            if (!token) {
              alert('You must select a token in order to proceed!');
              return;
            }

            const result = await this.challengeService.cancelChallenge(
              this.payload.challenge.id,
              token.token,
              this.payload.selectedEnv,
            );

            if (result.isSuccess) {
              alert('Challenge is cancelled!');
              this.close(true);
            } else {
              this.dialogService.openRequestResultDialog(result);
            }
          });
      });
  }
}
