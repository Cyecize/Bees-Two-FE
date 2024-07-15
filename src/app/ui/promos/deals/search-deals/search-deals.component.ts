import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-deals',
  standalone: true,
  imports: [],
  templateUrl: './search-deals.component.html',
  styleUrl: './search-deals.component.scss',
})
export class SearchDealsComponent {}

export const SEARCH_DEALS_ROUTES: Routes = [
  {
    path: '',
    component: SearchDealsComponent,
  },
];
