import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { RequestTemplate } from '../../../../api/template/request-template';
import { FieldError } from '../../../../shared/field-error/field-error';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { RouteNavigator } from '../../../../shared/routing/route-navigator.service';
import { AppRoutingPath } from '../../../../app-routing.path';

@Component({
  selector: 'app-add-template',
  standalone: true,
  imports: [TemplateFormComponent],
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss',
})
export class AddTemplateComponent {
  errors: FieldError[] = [];

  constructor(
    private templateService: RequestTemplateService,
    private nav: RouteNavigator,
  ) {}

  @ShowLoader()
  async formSubmitted(template: RequestTemplate): Promise<void> {
    const resp = await this.templateService.createTemplate(template);
    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.nav.navigate(AppRoutingPath.SEARCH_TEMPLATES);
    }
  }
}

export const ADD_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: AddTemplateComponent,
  },
];
