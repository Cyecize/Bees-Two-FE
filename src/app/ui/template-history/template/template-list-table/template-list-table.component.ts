import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { Page, PageImpl, pageToPagination } from '../../../../shared/util/page';
import { RequestTemplateView } from '../../../../api/template/request-template';
import { NgForOf } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { TemplateDetailsDialogComponent } from '../template-details-dialog/template-details-dialog.component';
import { MultienvTemplateRunnerDialogComponent } from '../multienv-template-runner-dialog/multienv-template-runner-dialog.component';
import { MultienvTemplateRunnerDialogPayload } from '../multienv-template-runner-dialog/multienv-template-runner-dialog.payload';

@Component({
  selector: 'app-template-list-table',
  standalone: true,
  imports: [NgForOf, PaginationComponent],
  templateUrl: './template-list-table.component.html',
  styleUrl: './template-list-table.component.scss',
})
export class TemplateListTableComponent {
  protected readonly pageToPagination = pageToPagination;

  @Input()
  templates: Page<RequestTemplateView> = new PageImpl([]);

  @Output()
  pageChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private templateService: RequestTemplateService,
    private dialogService: DialogService,
  ) {}

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  openPreview(template: RequestTemplateView): void {
    this.dialogService.openTemplatePreviewDialog(template);
  }

  openDetailsDialog(template: RequestTemplateView): void {
    this.dialogService
      .open(
        TemplateDetailsDialogComponent,
        `Template details for ${template.name}`,
        template,
      )
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.onPageChange(0);
        }
      });
  }

  openMultiRunner(template: RequestTemplateView): void {
    this.dialogService.open(
      MultienvTemplateRunnerDialogComponent,
      '',
      new MultienvTemplateRunnerDialogPayload(template),
    );
  }
}
