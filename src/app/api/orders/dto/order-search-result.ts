import { Order } from './order';
import { HasNextPagination } from '../../../shared/util/page';

export interface OrderSearchResult {
  orders: Order[];
  pagination: HasNextPagination;
}
