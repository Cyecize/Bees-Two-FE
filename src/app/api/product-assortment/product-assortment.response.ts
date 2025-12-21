/**
 * @monaco
 */
export interface ProductAssortmentResponse {
  items: ProductAssortmentItem[];
}

export interface ProductAssortmentItem {
  deliveryCenterId: string;
  deliveryMethods: string[];
  quantityMultiplier: number;
  rank: number;
  vendorId: string;
  vendorItemId: string;
}
