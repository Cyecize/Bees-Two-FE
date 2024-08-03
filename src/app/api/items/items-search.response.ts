import { Item } from './item';
import { HasNextPagination } from '../../shared/util/page';

export interface ItemsSearchResponse {
  items: Item[];
  pagination: HasNextPagination;
}
