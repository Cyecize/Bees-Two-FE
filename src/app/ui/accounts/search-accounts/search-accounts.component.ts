import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-accounts',
  standalone: true,
  imports: [],
  templateUrl: './search-accounts.component.html',
  styleUrl: './search-accounts.component.scss',
})
export class SearchAccountsComponent {}

export const SEARCH_ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    component: SearchAccountsComponent,
  },
];
