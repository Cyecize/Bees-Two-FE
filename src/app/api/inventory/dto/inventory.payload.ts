import { InventoryItemType } from '../enums/inventory-item-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface InventoryPayload {
  deliveryCenterIds: string[];
  inventories: InventoryQuantityPayload[];
}

export interface InventoryQuantityPayload {
  vendorItemId: string;
  quantity: number;
  expirationDate: string | null; //2023-12-31
  itemType: InventoryItemType | null; //Defaults to vendor item
  itemPackageId?: string | null;
  isSimpleInventory?: boolean | null; //Defaults to false
}
