import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-items-base',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './items-base.component.html',
  styleUrl: './items-base.component.scss',
})
export class ItemsBaseComponent {
  routes = AppRoutingPath;
}
