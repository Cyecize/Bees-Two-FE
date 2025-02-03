import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search-request-history',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './search-request-history.html',
  styleUrl: './search-request-history.scss',
})
export class SearchRequestHistory {
  routes = AppRoutingPath;
}
