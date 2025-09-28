import { BeesParam } from '../../common/bees-param';
import { BeesQueryParamsHelper } from '../../../shared/util/bees-query-params.helper';

/**
 * @monaco
 */
export interface InventoryV1Query {
  vendorId: string | null;
  deliveryCenters: string[];
  vendorAccountId: string | null;
  vendorItemIds: string[];
  toBeesQueryParams(): BeesParam[];
}

export class InventoryV1QueryImpl implements InventoryV1Query {
  vendorId: string | null = null;
  deliveryCenters: string[] = [];
  vendorAccountId: string | null = null;
  vendorItemIds: string[] = [];

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];
    return BeesQueryParamsHelper.toBeesParams(this, result);
  }
}
