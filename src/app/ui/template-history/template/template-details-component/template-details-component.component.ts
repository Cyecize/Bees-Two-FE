import { Component, Input, OnInit } from '@angular/core';
import {
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
} from '../../../../api/template/request-template';
import { NgIf } from '@angular/common';
import { ObjectUtils } from '../../../../shared/util/object-utils';

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

  constructor() {}

  ngOnInit(): void {}
}
