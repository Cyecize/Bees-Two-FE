import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-assortment-inclusion',
  standalone: true,
  imports: [],
  templateUrl: './assortment-inclusion.component.html',
  styleUrl: './assortment-inclusion.component.scss',
})
export class AssortmentInclusionComponent {}

export const ASSORTMENT_INCLUSION_ROUTES: Routes = [
  {
    path: '',
    component: AssortmentInclusionComponent,
  },
];
