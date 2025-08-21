import { Inventory } from './inventory';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface InventoriesResponse {
  inventories: InventoryResponse[];
}

export interface InventoryResponse {
  deliveryCenterId: string;
  vendorId: string;
  vendorAccountId?: string;
  inventoriesAvailable: Inventory[];
}
