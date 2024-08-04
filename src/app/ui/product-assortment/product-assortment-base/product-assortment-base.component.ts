import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-assortment-base',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './product-assortment-base.component.html',
  styleUrl: './product-assortment-base.component.scss',
})
export class ProductAssortmentBaseComponent {
  routes = AppRoutingPath;
}
