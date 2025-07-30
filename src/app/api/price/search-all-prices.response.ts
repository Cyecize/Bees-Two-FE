import { SingleItemPriceV3 } from './single-item-price-v3';

/**
 * @monaco
 */
export interface SearchAllPricesResponse {
  hasErrors: boolean;
  prices: SingleItemPriceV3[];
}
