import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-add-deal',
  standalone: true,
  imports: [],
  templateUrl: './add-deal.component.html',
  styleUrl: './add-deal.component.scss',
})
export class AddDealComponent {}

export const ADD_DEALS_ROUTES: Routes = [
  {
    path: '',
    component: AddDealComponent,
  },
];
