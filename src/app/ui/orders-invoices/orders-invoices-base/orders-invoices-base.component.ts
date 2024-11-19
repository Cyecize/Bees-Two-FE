import { Component } from '@angular/core';
import { AppRoutingPath } from '../../../app-routing.path';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders-invoices-base',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './orders-invoices-base.component.html',
  styleUrl: './orders-invoices-base.component.scss',
})
export class OrdersInvoicesBaseComponent {
  routes = AppRoutingPath;
}
