import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import {
  RequestTemplate,
  RequestTemplateView,
} from '../../../../api/template/request-template';
import { FieldError } from '../../../../shared/field-error/field-error';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { RouteNavigator } from '../../../../shared/routing/route-navigator.service';
import { AppRoutingPath } from '../../../../app-routing.path';

@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [TemplateFormComponent],
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss',
})
export class EditTemplateComponent implements OnInit {
  errors: FieldError[] = [];
  template!: RequestTemplateView;

  constructor(
    private templateService: RequestTemplateService,
    private nav: RouteNavigator,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.params['id']);
    if (isNaN(id)) {
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

    const templateResp = await this.templateService.getTemplate(id);
    if (!templateResp.isSuccess) {
      this.nav.navigate(AppRoutingPath.NOT_FOUND);
      return;
    }

    this.template = templateResp.response;
  }

  @ShowLoader()
  async formSubmitted(template: RequestTemplate): Promise<void> {
    const resp = await this.templateService.saveTemplate(
      this.template.id,
      template,
    );
    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.nav.navigate(AppRoutingPath.SEARCH_TEMPLATES);
    }
  }
}

export const EDIT_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: EditTemplateComponent,
  },
];
