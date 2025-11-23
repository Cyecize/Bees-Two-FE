import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { RequestTemplateFull } from '../../../../api/template/request-template';
import { firstValueFrom, Observable } from 'rxjs';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { RouteUtils } from '../../../../shared/routing/route-utils';
import { AppRoutingPath } from '../../../../app-routing.path';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { RouterLink } from '@angular/router';
import { TemplateDetailsComponentComponent } from '../template-details-component/template-details-component.component';

@Component({
  templateUrl: './template-details-dialog.component.html',
  standalone: true,
  imports: [RouterLink, TemplateDetailsComponentComponent],
})
export class TemplateDetailsDialogComponent
  extends DialogContentBaseComponent<RequestTemplateFull>
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
    this.dialogService.openTemplatePreviewDialog(this.payload, false);
  }

  getEditRoute(): string {
    return RouteUtils.setPathParams(AppRoutingPath.EDIT_TEMPLATE.toString(), [
      this.payload.id,
    ]);
  }
}
