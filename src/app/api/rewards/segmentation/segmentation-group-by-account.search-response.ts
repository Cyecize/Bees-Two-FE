import { SegmentationGroupByAccountModel } from './segmentation-group-by-account.model';
import { PaginationV2 } from '../../../shared/util/page';

export interface SegmentationGroupByAccountSearchResponse {
  content: SegmentationGroupByAccountModel[];
  pagination: PaginationV2;
}
