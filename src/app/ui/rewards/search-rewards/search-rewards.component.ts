import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-rewards',
  standalone: true,
  imports: [],
  templateUrl: './search-rewards.component.html',
  styleUrl: './search-rewards.component.scss',
})
export class SearchRewardsComponent {}

export const SEARCH_REWARDS_ROUTES: Routes = [
  {
    path: '',
    component: SearchRewardsComponent,
  },
];
