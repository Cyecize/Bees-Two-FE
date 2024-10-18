import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-search-challenges',
  standalone: true,
  imports: [],
  templateUrl: './search-challenges.component.html',
  styleUrl: './search-challenges.component.scss',
})
export class SearchChallengesComponent implements OnInit {
  ngOnInit(): void {}
}

export const SEARCH_CHALLENGES_ROUTES: Routes = [
  {
    path: '',
    component: SearchChallengesComponent,
  },
];
