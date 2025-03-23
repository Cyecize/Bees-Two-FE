import { PageRequest, PageRequestImpl } from '../../shared/util/page-request';
import { VendorFulfilmentCoverageType } from './enums/vendor-fulfilment-coverage-type';
import { BeesParam, BeesParamImpl } from '../common/bees-param';

export interface VendorV2Query {
  page: PageRequest;
  vendorId: string[];
  countries: string[];
  governmentId: string | null;
  serviceModel: string[];
  abiVendorId: string[];
  projection: string[];
  fulfillmentCoverageType: VendorFulfilmentCoverageType[];
  fulfillmentAlternativeCoverageType: VendorFulfilmentCoverageType[];

  toBeesQueryParams(): BeesParam[];
  toBeesHeaderParams(): BeesParam[];
}

export class VendorV2QueryImpl implements VendorV2Query {
  page = new PageRequestImpl();
  vendorId = [];
  countries = [];
  governmentId = null;
  serviceModel = [];
  abiVendorId = [];
  projection = [];
  fulfillmentCoverageType = [];
  fulfillmentAlternativeCoverageType = [];

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this)
      .filter((fieldName) => fieldName !== 'countries')
      .forEach((fieldName) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const val = this[fieldName];

        if (
          (typeof val === 'string' && val.trim()) ||
          typeof val === 'boolean'
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result.push(new BeesParamImpl(fieldName, this[fieldName]));
        }

        if (Array.isArray(val) && val.length > 0) {
          result.push(new BeesParamImpl(fieldName, val.join(',')));
        }
      });

    return result;
  }
  toBeesHeaderParams(): BeesParam[] {
    const params: BeesParam[] = [];

    if (!this.countries.length) {
      return params;
    }

    params.push(new BeesParamImpl('countries', this.countries.join(',')));

    return params;
  }
}
