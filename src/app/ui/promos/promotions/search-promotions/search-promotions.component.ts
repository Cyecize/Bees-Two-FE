import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-promotions',
  standalone: true,
  imports: [],
  templateUrl: './search-promotions.component.html',
  styleUrl: './search-promotions.component.scss',
})
export class SearchPromotionsComponent {}

export const SEARCH_PROMOTIONS_ROUTES: Routes = [
  {
    path: '',
    component: SearchPromotionsComponent,
  },
];
