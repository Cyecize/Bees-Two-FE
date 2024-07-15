import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { AppRoutingPath } from '../../../app-routing.path';

@Component({
  selector: 'app-promos-base',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './promos-base.component.html',
  styleUrl: './promos-base.component.scss',
})
export class PromosBaseComponent {
  routes = AppRoutingPath;
}
