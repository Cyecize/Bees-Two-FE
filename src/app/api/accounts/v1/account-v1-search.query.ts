import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';

/**
 * @monaco
 */
export interface AccountV1SearchQuery {
  accountId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
  taxId?: string;
  vendorId?: string;
  page: PageRequest;

  toBeesQueryParams(): BeesParam[];
}

export class AccountV1SearchQueryImpl implements AccountV1SearchQuery {
  accountId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
  taxId?: string;
  vendorId?: string;
  page: PageRequest = new PageRequestImpl();

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // @ts-ignore
      const val = this[fieldName];

      if (typeof val === 'string' && val.trim()) {
        // @ts-ignore
        result.push(new BeesParamImpl(fieldName, this[fieldName]));
      }
    });

    return result;
  }
}
