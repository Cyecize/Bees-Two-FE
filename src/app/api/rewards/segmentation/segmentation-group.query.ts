import { BeesParam, BeesParamImpl } from '../../common/bees-param';

export interface SegmentationGroupQuery {
  purposes: string[];
  names: string[];

  toBeesParams(): BeesParam[];
}

export class SegmentationGroupQueryImpl implements SegmentationGroupQuery {
  purposes: string[] = [];
  names: string[] = [];

  toBeesParams(): BeesParam[] {
    const res: BeesParam[] = [];

    if (this.purposes.length) {
      res.push(new BeesParamImpl('purposes', this.purposes.join(',')));
    }

    if (this.names.length) {
      res.push(new BeesParamImpl('names', this.names.join(',')));
    }

    return res;
  }
}
