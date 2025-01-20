import { PriceType } from './price.type';

export interface SingleItemPriceV3 {
  vendorItemId: string;
  sku: string;

  // Platform ID
  itemId: string;

  // Platform ID
  contractId: string;
  basePrice: number;
  minimumPrice: number;
  measureUnit: string;
  type: PriceType;
  quantityPerPallet: number;
  timezone: string;
  taxes: SingleItemPriceV3Tax[];
}

export interface SingleItemPriceV3Tax {
  taxId: string;
  type: string; // % or $, make it enum?
  value: number;
  hidden: boolean;
}
