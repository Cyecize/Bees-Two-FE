import { InventoryItemType } from '../enums/inventory-item-type';

/**
 * @monaco
 */
export interface Inventory {
  vendorItemId?: string;
  quantity: number;
  itemType: InventoryItemType;
  itemPackageId: string;
  expirationDate?: string;
  daysToExpire?: number;
  validFrom?: string;
  simpleInventory: boolean;
}
