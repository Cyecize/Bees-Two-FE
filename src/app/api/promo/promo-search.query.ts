import { PageRequest, PageRequestImpl } from '../../shared/util/page-request';
import { PromoType } from './promo-type';
import { BeesParam, BeesParamImpl } from '../common/bees-param';
import { ObjectUtils } from '../../shared/util/object-utils';

/**
 * @monaco
 */
export interface PromoSearchQuery {
  vendorIds: string[];
  promotionPlatformIds: string[];
  page: PageRequest;
  types: PromoType[];
  query?: string;
  ignoreStartDate?: boolean;
  toBeesParams(): BeesParam[];
}

export class PromoSearchQueryImpl implements PromoSearchQuery {
  vendorIds: string[] = [];
  page: PageRequest = new PageRequestImpl();
  types: PromoType[] = [];
  query?: string;
  ignoreStartDate?: boolean;
  promotionPlatformIds: string[] = [];
  toBeesParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(new BeesParamImpl('vendorIds', this.vendorIds.join(',')));
    result.push(...this.page.toBeesParams());

    if (this.types.length > 0) {
      result.push(new BeesParamImpl('types', this.types.join(',')));
    }

    if (this.promotionPlatformIds.length > 0) {
      result.push(
        new BeesParamImpl(
          'promotionPlatformIds',
          this.promotionPlatformIds.join(','),
        ),
      );
    }

    if (!ObjectUtils.isNil(this.query)) {
      result.push(new BeesParamImpl('query', this.query));
    }

    if (!ObjectUtils.isNil(this.ignoreStartDate)) {
      result.push(new BeesParamImpl('ignoreStartDate', this.ignoreStartDate));
    }

    return result;
  }
}
