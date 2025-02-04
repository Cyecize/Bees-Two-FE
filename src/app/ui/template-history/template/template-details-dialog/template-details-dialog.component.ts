import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { firstValueFrom, Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../../shared/components/copy-icon/copy-icon.component';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { RouteUtils } from '../../../../shared/routing/route-utils';
import { AppRoutingPath } from '../../../../app-routing.path';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './template-details-dialog.component.html',
  standalone: true,
  imports: [NgIf, CopyIconComponent, RouterLink],
})
export class TemplateDetailsDialogComponent
  extends DialogContentBaseComponent<RequestTemplateView>
  implements OnInit
{
  protected readonly ObjectUtils = ObjectUtils;

  constructor(
    private dialogService: DialogService,
    private requestTemplateService: RequestTemplateService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  ngOnInit(): void {}

  async delete(): Promise<void> {
    const confirmed = await firstValueFrom(
      this.dialogService.openConfirmDialog(
        'Are you sure you want to remove this template?',
        `Removing template ${this.payload.name}`,
        'Yes',
      ),
    );

    if (!confirmed) {
      return;
    }

    const resp = await this.requestTemplateService.deleteTemplate(
      this.payload.id,
    );

    if (!resp.isSuccess) {
      alert('Could not remove template, check the console!');
      console.log(resp);
    } else {
      this.close(true);
    }
  }

  openPreview(): void {
    this.dialogService.openTemplatePreviewDialog(this.payload);
  }

  getEditRoute(): string {
    return RouteUtils.setPathParams(AppRoutingPath.EDIT_TEMPLATE.toString(), [
      this.payload.id,
    ]);
  }
}
