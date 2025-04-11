import { Item } from './item';
import { HasNextPagination } from '../../shared/util/page';

/**
 * @monaco
 */
export interface ItemsSearchResponse {
  items: Item[];
  pagination: HasNextPagination;
}
