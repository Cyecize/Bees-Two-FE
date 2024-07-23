import { HasNextPagination } from '../../shared/util/page';
import { Promo } from './promo';

export interface PromoSearchResponse {
  pagination: HasNextPagination;
  promotions: Promo[];
}
