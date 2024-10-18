import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-create-challenge',
  standalone: true,
  imports: [],
  templateUrl: './create-challenge.component.html',
  styleUrl: './create-challenge.component.scss',
})
export class CreateChallengeComponent implements OnInit {
  ngOnInit(): void {}
}

export const CREATE_CHALLENGES_ROUTES: Routes = [
  {
    path: '',
    component: CreateChallengeComponent,
  },
];
