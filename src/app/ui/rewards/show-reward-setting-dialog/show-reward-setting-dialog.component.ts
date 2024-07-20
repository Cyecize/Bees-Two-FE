import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-reward-setting-dialog',
  standalone: true,
  imports: [],
  templateUrl: './show-reward-setting-dialog.component.html',
  styleUrl: './show-reward-setting-dialog.component.scss',
})
export class ShowRewardSettingDialogComponent
  extends DialogContentBaseComponent<RewardSetting>
  implements OnInit
{
  dataJson!: string;

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload, null, 2);
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    navigator.clipboard.writeText(this.dataJson);
  }
}
