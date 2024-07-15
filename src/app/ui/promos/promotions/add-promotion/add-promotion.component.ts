import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-add-promotion',
  standalone: true,
  imports: [],
  templateUrl: './add-promotion.component.html',
  styleUrl: './add-promotion.component.scss',
})
export class AddPromotionComponent {}

export const ADD_PROMOTION_ROUTES: Routes = [
  {
    path: '',
    component: AddPromotionComponent,
  },
];
