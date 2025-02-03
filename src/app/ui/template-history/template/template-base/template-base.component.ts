import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template-base',
  standalone: true,
  imports: [RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './template-base.component.html',
  styleUrl: './template-base.component.scss',
})
export class TemplateBaseComponent {
  routes = AppRoutingPath;
}
