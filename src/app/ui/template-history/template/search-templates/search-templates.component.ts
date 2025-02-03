import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-templates',
  standalone: true,
  imports: [],
  templateUrl: './search-templates.component.html',
  styleUrl: './search-templates.component.scss',
})
export class SearchTemplatesComponent {}

export const SEARCH_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: SearchTemplatesComponent,
  },
];
