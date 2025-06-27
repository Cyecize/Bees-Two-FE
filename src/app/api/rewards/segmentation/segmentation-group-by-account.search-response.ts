import { SegmentationGroupByAccountModel } from './segmentation-group-by-account.model';
import { PaginationV2 } from '../../../shared/util/page';

/**
 * @monaco
 */
export interface SegmentationGroupByAccountSearchResponse {
  content: SegmentationGroupByAccountModel[];
  pagination: PaginationV2;
}
