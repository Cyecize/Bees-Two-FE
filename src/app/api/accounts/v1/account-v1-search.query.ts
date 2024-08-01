import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';

export interface AccountV1SearchQuery {
  accountId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
  taxId?: string;
  vendorId?: string;
  page: PageRequest;

  toBeesQueryParams(): BeesParamPayload[];
}

export class AccountV1SearchQueryImpl implements AccountV1SearchQuery {
  accountId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
  taxId?: string;
  vendorId?: string;
  page: PageRequest = new PageRequestImpl();

  toBeesQueryParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // @ts-ignore
      const val = this[fieldName];

      if (typeof val === 'string' && val.trim()) {
        // @ts-ignore
        result.push(new BeesParamPayloadImpl(fieldName, this[fieldName]));
      }
    });

    return result;
  }
}
