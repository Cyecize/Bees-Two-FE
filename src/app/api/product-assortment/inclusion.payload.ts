import { BeesDeliveryMethod } from '../common/bees.delivery.method';

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
