import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';

export interface SegmentationGroupByAccountQuery {
  page: PageRequest;
  accountIds: string[];
  groupIds: string[];

  toBeesParams(): BeesParamPayload[];
}

export class SegmentationGroupByAccountQueryImpl
  implements SegmentationGroupByAccountQuery
{
  page: PageRequest = new PageRequestImpl();
  accountIds: string[] = [];
  groupIds: string[] = [];

  toBeesParams(): BeesParamPayload[] {
    const res: BeesParamPayload[] = [];

    res.push(...this.page.toBeesParams());

    if (this.accountIds.length) {
      res.push(
        new BeesParamPayloadImpl('accountIds', this.accountIds.join(',')),
      );
    }

    if (this.groupIds.length) {
      res.push(new BeesParamPayloadImpl('groupIds', this.groupIds.join(',')));
    }

    return res;
  }
}
