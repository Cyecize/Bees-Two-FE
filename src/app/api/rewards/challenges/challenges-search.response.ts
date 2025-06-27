import { Challenge } from './challenge';
import { Pagination } from '../../../shared/util/page';

/**
 * @monaco
 */
export interface ChallengesSearchResponse {
  content: Challenge[];
  pagination: Pagination;
}
