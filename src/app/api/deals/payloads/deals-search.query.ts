import {
  PageRequest,
  PageRequestImplV2,
} from '../../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { DealOutputType } from '../enums/deal-output-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface DealsSearchQuery {
  types: DealOutputType[];
  page: PageRequest;
  ignoreStartDate?: boolean;
  ignoreEndDate?: boolean;
  body: DealsSearchQueryBody;
  toBeesQueryParams(): BeesParam[];
  toEditRouteQueryParams(): { [p: string]: string | number | undefined };
}

export interface DealsSearchQueryBody {
  contractId?: string;
  couponCode: string[];
  deliveryCenterId?: string;
  deliveryDate?: string;
  firstOrder?: boolean;
  hiddenOnDeals?: boolean;
  hiddenOnBrowse?: boolean;
  itemIds: string[];
  orderSubtotal?: number;
  orderTotal?: number;
  paymentTerm?: number;
  accountTier?: string;
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
  hiddenOnBrowse?: boolean;
  itemIds: string[] = [];
  orderSubtotal?: number;
  orderTotal?: number;
  paymentTerm?: number;
  accountTier?: string;
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
  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    if (this.types.length > 0) {
      result.push(new BeesParamImpl('types', this.types.join(',')));
    }

    if (!ObjectUtils.isNil(this.ignoreStartDate)) {
      result.push(new BeesParamImpl('ignoreStartDate', this.ignoreStartDate));
    }

    if (!ObjectUtils.isNil(this.ignoreEndDate)) {
      result.push(new BeesParamImpl('ignoreEndDate', this.ignoreEndDate));
    }

    return result;
  }

  toEditRouteQueryParams(): { [p: string]: string | number | undefined } {
    return {
      contractId: this.body.contractId,
      priceListId: this.body.priceListId,
      deliveryCenterId: this.body.deliveryCenterId,
      accountTier: this.body.accountTier,
    };
  }

  static fromEditRouteParams(params: { [p: string]: any }): DealsSearchQuery {
    const query = new DealsSearchQueryImpl();
    query.body.contractId = params['contractId'];
    query.body.priceListId = params['priceListId'];
    query.body.deliveryCenterId = params['deliveryCenterId'];
    query.body.accountTier = params['accountTier'];

    return query;
  }
}
