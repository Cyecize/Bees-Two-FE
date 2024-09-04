import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';

export interface SegmentationGroupQuery {
  purposes: string[];
  names: string[];

  toBeesParams(): BeesParamPayload[];
}

export class SegmentationGroupQueryImpl implements SegmentationGroupQuery {
  purposes: string[] = [];
  names: string[] = [];

  toBeesParams(): BeesParamPayload[] {
    const res: BeesParamPayload[] = [];

    if (this.purposes.length) {
      res.push(new BeesParamPayloadImpl('purposes', this.purposes.join(',')));
    }

    if (this.names.length) {
      res.push(new BeesParamPayloadImpl('names', this.names.join(',')));
    }

    return res;
  }
}
