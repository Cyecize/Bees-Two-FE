import { PageRequest, PageRequestImpl } from '../../shared/util/page-request';
import { PromoType } from './promo-type';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../proxy/bees-param.payload';
import { ObjectUtils } from '../../shared/util/object-utils';

export interface PromoSearchQuery {
  vendorIds: string[];
  page: PageRequest;
  types: PromoType[];
  query?: string;
  ignoreStartDate?: boolean;
  toBeesParams(): BeesParamPayload[];
}

export class PromoSearchQueryImpl implements PromoSearchQuery {
  vendorIds: string[] = [];
  page: PageRequest = new PageRequestImpl();
  types: PromoType[] = [];
  query?: string;
  ignoreStartDate?: boolean;
  toBeesParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(
      new BeesParamPayloadImpl('vendorIds', this.vendorIds.join(',')),
    );
    result.push(...this.page.toBeesParams());

    if (this.types.length > 0) {
      result.push(new BeesParamPayloadImpl('types', this.types.join(',')));
    }

    if (!ObjectUtils.isNil(this.query)) {
      result.push(new BeesParamPayloadImpl('query', this.query));
    }

    if (!ObjectUtils.isNil(this.ignoreStartDate)) {
      result.push(
        new BeesParamPayloadImpl('ignoreStartDate', this.ignoreStartDate),
      );
    }

    return result;
  }
}
