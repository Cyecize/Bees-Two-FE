import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';

/**
 * @monaco
 */
export interface SegmentationGroupByAccountQuery {
  page: PageRequest;
  accountIds: string[];
  groupIds: string[];

  toBeesParams(): BeesParam[];
}

export class SegmentationGroupByAccountQueryImpl
  implements SegmentationGroupByAccountQuery
{
  page: PageRequest = new PageRequestImpl();
  accountIds: string[] = [];
  groupIds: string[] = [];

  toBeesParams(): BeesParam[] {
    const res: BeesParam[] = [];

    res.push(...this.page.toBeesParams());

    if (this.accountIds.length) {
      res.push(new BeesParamImpl('accountIds', this.accountIds.join(',')));
    }

    if (this.groupIds.length) {
      res.push(new BeesParamImpl('groupIds', this.groupIds.join(',')));
    }

    return res;
  }
}
