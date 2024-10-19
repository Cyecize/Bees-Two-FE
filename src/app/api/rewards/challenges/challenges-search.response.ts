import { Challenge } from './challenge';
import { Pagination } from '../../../shared/util/page';

export interface ChallengesSearchResponse {
  content: Challenge[];
  pagination: Pagination;
}
