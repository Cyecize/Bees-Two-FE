import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { TemplateSearchFiltersComponent } from '../template-search-filters/template-search-filters.component';
import { RequestTemplateQuery } from '../../../../api/template/request-template.query';
import { RequestTemplateService } from '../../../../api/template/request-template.service';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import { TemplateListTableComponent } from '../template-list-table/template-list-table.component';
import { Page, PageImpl } from '../../../../shared/util/page';
import {
  RequestTemplateDtoForSearch,
  RequestTemplateFull,
} from '../../../../api/template/request-template';
import { FieldError } from '../../../../shared/field-error/field-error';

@Component({
  selector: 'app-search-templates',
  standalone: true,
  imports: [TemplateSearchFiltersComponent, TemplateListTableComponent],
  templateUrl: './search-templates.component.html',
  styleUrl: './search-templates.component.scss',
})
export class SearchTemplatesComponent implements OnInit {
  templates: Page<RequestTemplateDtoForSearch> = new PageImpl([]);
  errors: FieldError[] = [];
  query!: RequestTemplateQuery;

  constructor(private templateService: RequestTemplateService) {}

  ngOnInit(): void {}

  async onQueryChange(query: RequestTemplateQuery): Promise<void> {
    this.query = query;
    await this.fetch();
  }

  onPageChange(page: number): void {
    this.query.page.pageNumber = page;
    void this.fetch();
  }

  @ShowLoader()
  private async fetch(): Promise<void> {
    this.templates = new PageImpl([]);
    const resp = await this.templateService.searchTemplates(this.query);

    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.templates = resp.response;
    } else {
      alert('Could not fetch templates, try again!');
    }
  }
}

export const SEARCH_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: SearchTemplatesComponent,
  },
];
