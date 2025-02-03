import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template-history-base',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './template-and-history-base.component.html',
  styleUrl: './template-and-history-base.component.scss',
})
export class TemplateAndHistoryBaseComponent {
  routes = AppRoutingPath;
}
