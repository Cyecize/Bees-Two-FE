import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';
import { ContractStatus } from './contract-status';
import { ContractClassificationType } from './contract-classification-type';

/*
id (The BEES Contract deterministic ID, it is the encoded hash of the vendorAccountId + vendorId)
accountId
accountId + status
accountId + vendorId
accountId + vendorId + status
taxId
taxId + vendorId
deliveryCenterId
deliveryCenterId + vendorId
customerAccountId + vendorId
vendorId + priceListId
vendorId + classificationType
 */

export interface BeesContractQuery {
  id: string | null;
  taxId: string[];
  deliveryCenterId: string[];
  vendorId: string[];
  customerAccountId: string[];
  vendorAccountId: string[];
  accountId: string[];
  status: ContractStatus[];
  priceListId: string[];
  projection: string[];
  classificationType: ContractClassificationType[];
  page: PageRequest;
  includes: string[];
  toBeesQueryParams(): BeesParam[];
}

export class BeesContractQueryImpl implements BeesContractQuery {
  accountId: string[] = [];
  classificationType: ContractClassificationType[] = [];
  customerAccountId: string[] = [];
  vendorAccountId: string[] = [];
  deliveryCenterId: string[] = [];
  id: string | null = null;
  includes: string[] = [];
  page: PageRequest = new PageRequestImpl();
  priceListId: string[] = [];
  projection: string[] = [];
  status: ContractStatus[] = [];
  taxId: string[] = [];
  vendorId: string[] = [];

  public toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const val = this[fieldName];

      if ((typeof val === 'string' && val.trim()) || typeof val === 'boolean') {
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
}
