import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { RewardSetting } from '../../../api/rewards/settings/rewards-settings-search.response';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { RouteUtils } from '../../../shared/routing/route-utils';
import { AppRoutingPath } from '../../../app-routing.path';
import { ShowRewardSettingDialogPayload } from './show-reward-setting-dialog.payload';

@Component({
  selector: 'app-show-reward-setting-dialog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-reward-setting-dialog.component.html',
  styleUrl: './show-reward-setting-dialog.component.scss',
})
export class ShowRewardSettingDialogComponent
  extends DialogContentBaseComponent<ShowRewardSettingDialogPayload>
  implements OnInit
{
  dataJson!: string;

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.setting, null, 2);
  }

  getEditRoute(): string {
    return RouteUtils.setPathParams(
      AppRoutingPath.EDIT_REWARDS_SETTINGS.toString(),
      [
        this.payload.setting.level,
        this.payload.setting.settingId,
        this.payload.setting.tier,
        this.payload.setting.type,
        this.payload.selectedEnv?.id,
      ],
    );
  }

  getEditRawRoute(): string {
    return RouteUtils.setPathParams(
      AppRoutingPath.EDIT_REWARDS_SETTINGS_RAW.toString(),
      [
        this.payload.setting.level,
        this.payload.setting.settingId,
        this.payload.setting.tier,
        this.payload.setting.type,
        this.payload.selectedEnv?.id,
      ],
    );
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    void navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    alert('bout 2 delete!');
  }
}
