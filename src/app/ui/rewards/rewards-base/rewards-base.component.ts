import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { AppRoutingPath } from '../../../app-routing.path';

@Component({
  selector: 'app-rewards-base',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './rewards-base.component.html',
  styleUrl: './rewards-base.component.scss',
})
export class RewardsBaseComponent {
  routes = AppRoutingPath;
}
