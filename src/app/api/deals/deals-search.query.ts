import { PageRequest, PageRequestImplV2 } from '../../shared/util/page-request';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../proxy/bees-param.payload';
import { ObjectUtils } from '../../shared/util/object-utils';
import { DealOutputType } from './deal-output-type';

export interface DealsSearchQuery {
  types: DealOutputType[];
  page: PageRequest;
  ignoreStartDate?: boolean;
  ignoreEndDate?: boolean;
  body: DealsSearchQueryBody;
  toBeesQueryParams(): BeesParamPayload[];
}

export interface DealsSearchQueryBody {
  contractId?: string;
  couponCode: string[];
  deliveryCenterId?: string;
  deliveryDate?: string;
  firstOrder?: boolean;
  hiddenOnDeals?: boolean;
  itemIds: string[];
  orderSubtotal?: number;
  orderTotal?: number;
  paymentMethod?: string;
  priceListId?: string;
  vendorDealId?: string;
  vendorId?: string;
  vendorPromotionIds: string[];
  sanitize(): DealsSearchQueryBody;
}

export class DealsSearchQueryBodyImpl implements DealsSearchQueryBody {
  contractId?: string;
  couponCode: string[] = [];
  deliveryCenterId?: string;
  deliveryDate?: string;
  firstOrder?: boolean;
  hiddenOnDeals?: boolean;
  itemIds: string[] = [];
  orderSubtotal?: number;
  orderTotal?: number;
  paymentMethod?: string;
  priceListId?: string;
  vendorDealId?: string;
  vendorId?: string;
  vendorPromotionIds: string[] = [];
  public sanitize(): DealsSearchQueryBody {
    Object.keys(this).forEach((fieldName) => {
      // @ts-ignore
      const val = this[fieldName];

      if (typeof val === 'string' && !val.trim()) {
        // @ts-ignore
        this[fieldName] = undefined;
      }
    });
    return this;
  }
}

export class DealsSearchQueryImpl implements DealsSearchQuery {
  page: PageRequest = new PageRequestImplV2();
  types: DealOutputType[] = [];
  ignoreStartDate?: boolean;
  ignoreEndDate?: boolean;
  body: DealsSearchQueryBody = new DealsSearchQueryBodyImpl();
  toBeesQueryParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(...this.page.toBeesParams());

    if (this.types.length > 0) {
      result.push(new BeesParamPayloadImpl('types', this.types.join(',')));
    }

    if (!ObjectUtils.isNil(this.ignoreStartDate)) {
      result.push(
        new BeesParamPayloadImpl('ignoreStartDate', this.ignoreStartDate),
      );
    }

    if (!ObjectUtils.isNil(this.ignoreEndDate)) {
      result.push(
        new BeesParamPayloadImpl('ignoreEndDate', this.ignoreEndDate),
      );
    }

    return result;
  }
}
