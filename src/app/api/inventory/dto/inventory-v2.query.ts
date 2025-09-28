import { DeliveryDateDirection } from '../enums/delivery-date-direction';
import { BeesParam } from '../../common/bees-param';
import { BeesQueryParamsHelper } from '../../../shared/util/bees-query-params.helper';

/**
 * @monaco
 */
export interface InventoryV2Query {
  inventoryPlatformIds: string[];
  orderBy: string | null;
  deliveryDate: string | null; //LocalDate (ISO)
  deliveryDateDirection: DeliveryDateDirection | null;
  toBeesQueryParams(): BeesParam[];
}

export class InventoryV2QueryImpl implements InventoryV2Query {
  inventoryPlatformIds: string[] = [];
  orderBy: string | null = null;
  deliveryDate: string | null = null;
  deliveryDateDirection: DeliveryDateDirection | null = null;

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];
    return BeesQueryParamsHelper.toBeesParams(this, result);
  }
}
