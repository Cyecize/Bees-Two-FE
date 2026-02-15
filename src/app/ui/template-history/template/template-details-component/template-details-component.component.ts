import { Component, Input, OnInit } from '@angular/core';
import {
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
} from '../../../../api/template/request-template';
import { NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { DialogService } from '../../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-template-details-component',
  templateUrl: './template-details-component.component.html',
  standalone: true,
  imports: [NgIf],
})
export class TemplateDetailsComponentComponent implements OnInit {
  protected readonly ObjectUtils = ObjectUtils;

  @Input()
  template!: RequestTemplateDtoForSearch | RequestTemplateFull;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  protected showDescriptionInDialog(): void {
    this.dialogService.showFormattedContent(
      this.template.description,
      'Description',
    );
  }
}
