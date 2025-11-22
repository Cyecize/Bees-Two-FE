import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import {
  RequestTemplate,
  RequestTemplateFull,
} from '../../../../api/template/request-template';
import { FieldError } from '../../../../shared/field-error/field-error';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { RouteNavigator } from '../../../../shared/routing/route-navigator.service';
import { AppRoutingPath } from '../../../../app-routing.path';
import { UserService } from '../../../../api/user/user.service';
import { User } from '../../../../api/user/user';
import { firstValueFrom, Subscription } from 'rxjs';
import { DialogService } from '../../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [TemplateFormComponent],
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss',
})
export class EditTemplateComponent implements OnInit, OnDestroy {
  errors: FieldError[] = [];
  template!: RequestTemplateFull;
  currentUser!: User;
  private subs: Subscription[] = [];

  constructor(
    private templateService: RequestTemplateService,
    private userService: UserService,
    private nav: RouteNavigator,
    private route: ActivatedRoute,
    private dialogService: DialogService,
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
    this.subs.push(
      this.userService.currentUser$.subscribe((u) => (this.currentUser = u!)),
    );
  }

  async formSubmitted(template: RequestTemplate): Promise<void> {
    if (this.template.userId !== this.currentUser.id) {
      const conf = await firstValueFrom(
        this.dialogService.openConfirmDialog(
          'This template is owned by another person, are you sure you want to make changes?',
        ),
      );

      if (!conf) {
        return;
      }
    }

    await this.proceedToSave(template);
  }

  @ShowLoader()
  private async proceedToSave(template: RequestTemplate): Promise<void> {
    const resp = await this.templateService.saveTemplate(
      this.template.id,
      template,
    );
    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.nav.navigate(AppRoutingPath.SEARCH_TEMPLATES);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

export const EDIT_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: EditTemplateComponent,
  },
];
