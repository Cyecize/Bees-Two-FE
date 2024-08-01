import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppRoutingPath } from '../../../app-routing.path';

@Component({
  selector: 'app-accounts-base',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './accounts-base.component.html',
  styleUrl: './accounts-base.component.scss',
})
export class AccountsBaseComponent {
  routes = AppRoutingPath;
}
