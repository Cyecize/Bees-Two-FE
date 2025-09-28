/**
 * @monaco
 * @monaco_include_deps
 */
export interface InventoryItemResponse {
  deliveryCenterId: string;
  vendorId: string;
  inventories: ProductInventorySupplier[];
}

export interface ProductInventorySupplier {
  vendorItemId: string;
  quantity: string;
}
