import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-add-template',
  standalone: true,
  imports: [],
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss',
})
export class AddTemplateComponent {}

export const ADD_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    component: AddTemplateComponent,
  },
];
