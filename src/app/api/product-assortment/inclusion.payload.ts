import { ProductAssortmentDeliveryMethod } from './product-assortment-delivery-method';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface InclusionPayload {
  deliveryCenterIds: string[];
  assortments: AssortmentPayload[];
}

export interface AssortmentPayload {
  deliveryMethods: ProductAssortmentDeliveryMethod[];
  quantityMultiplier: number | null;
  rank: number | null;
  vendorItemId: string;
}
