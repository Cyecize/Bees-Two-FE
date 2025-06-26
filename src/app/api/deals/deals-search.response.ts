import {
  EmptyHasMorePagination,
  HasMorePagination,
} from '../../shared/util/page';
import { Deal } from './deal';

/**
 * @monaco
 */
export interface DealsSearchResponse {
  deals: Deal[];
  pagination: HasMorePagination;
}

export class EmptyDealsSearchResponse implements DealsSearchResponse {
  deals: any[] = [];
  pagination: HasMorePagination = new EmptyHasMorePagination();
}
