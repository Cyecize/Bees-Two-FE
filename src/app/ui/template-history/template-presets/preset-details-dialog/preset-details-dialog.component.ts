import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { firstValueFrom, Observable } from "rxjs";
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { PresetDetailsDialogPayload } from './preset-details-dialog.payload';
import { RequestTemplatePresetService } from '../../../../api/template/arg/preset/request-template-preset.service';
import { RequestTemplatePresetWithValues } from '../../../../api/template/arg/preset/request-template-preset';
import { NgIf } from '@angular/common';
import { TemplateArgPreviewComponent } from '../../template/template-arg-preview/template-arg-preview.component';
import { RequestTemplateArgView } from '../../../../api/template/arg/request-template-arg';
import { RequestTemplateArgUtil } from '../../../../api/template/arg/request-template-arg.util';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: './preset-details-dialog.component.html',
  standalone: true,
  imports: [NgIf, TemplateArgPreviewComponent, CheckboxComponent, FormsModule],
})
export class PresetDetailsDialogComponent
  extends DialogContentBaseComponent<PresetDetailsDialogPayload>
  implements OnInit
{
  protected readonly ObjectUtils = ObjectUtils;

  preset!: RequestTemplatePresetWithValues;
  appliedArgs: RequestTemplateArgView[] = [];

  filterOnlyPresetArgs = false;

  constructor(
    private dialogService: DialogService,
    private presetService: RequestTemplatePresetService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  async ngOnInit(): Promise<void> {
    this.preset = await this.presetService.getPreset(this.payload.preset.id);

    if (!this.preset) {
      alert(`Could not get preset with id ${this.payload.preset.id}!`);
      this.close(null);
      return;
    }

    this.updateAppliedArgs();
  }

  updateAppliedArgs(): void {
    this.appliedArgs = RequestTemplateArgUtil.applyPreset(
      this.payload.argValues,
      this.preset,
      this.filterOnlyPresetArgs,
    );
  }

  selectAndClose(): void {
    this.close(true);
  }

  protected async removeAndClose(): Promise<void> {
    const conf = await firstValueFrom(this.dialogService.openConfirmDialog(
      `Remove preset ${this.payload.preset.name}?`,
      'Confirm remove preset',
      'Remove'
    ));

    if (conf) {
      await this.presetService.deletePreset(this.payload.preset.id);
      this.close(false);
    }
  }
}
