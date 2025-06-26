import { HasNextPagination } from '../../shared/util/page';
import { Promo } from './promo';

/**
 * @monaco
 */
export interface PromoSearchResponse {
  pagination: HasNextPagination;
  promotions: Promo[];
}
