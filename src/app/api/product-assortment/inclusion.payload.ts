import { BeesDeliveryMethod } from '../common/bees.delivery.method';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface InclusionPayload {
  deliveryCenterIds: string[];
  assortments: AssortmentPayload[];
}

export interface AssortmentPayload {
  deliveryMethods: BeesDeliveryMethod[];
  quantityMultiplier: number | null;
  rank: number | null;
  vendorItemId: string;
}
