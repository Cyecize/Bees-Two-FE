import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowChallengeDialogPayload } from './show-challenge-dialog.payload';

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
    alert('bout 2 cancel!');
  }
}
