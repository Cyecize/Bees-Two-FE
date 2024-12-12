import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';

@Injectable({ providedIn: 'root' })
export class InventoryRepository {
  constructor(private proxyService: ProxyService) {}
}
