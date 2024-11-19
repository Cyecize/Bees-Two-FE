import { OrderStatus } from '../order.status';
import {
  PageRequest,
  PageRequestImplV3,
} from '../../../shared/util/page-request';
import { OrderOrderbyType } from '../order.orderby.type';
import { OrderStatusCondition } from '../order-status-condition';
import { SortDirection } from '../../../shared/util/sort.query';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';

export interface OrderQuery {
  page: PageRequest; // page and limit
  orderStatus: OrderStatus;
  beesAccountId?: string;
  deliveryCenterId?: string;
  endDeliveryDate?: string; // 2022-05-09 inclusive
  startDeliveryDate?: string; //2022-05-09 inclusive
  orderBy: OrderOrderbyType[];
  orderIds: string[];
  orderStatusCondition: OrderStatusCondition;
  sort: SortDirection;
  updatedSince?: string; //ISO date time
  vendorAccountId?: string;
  vendorId?: string;
  vendorOrderNumber?: string;
  startCreateAt?: string; // ISO date time eg, 2019-10-05T11:10:05.123Z
  endCreateAt?: string; // ISO date time, eg, 2019-10-05T11:59:59.999Z
  projection: string[];
  returnDeletedOrders?: boolean;

  toBeesQueryParams(): BeesParamPayload[];
}

export class OrderQueryImpl implements OrderQuery {
  page: PageRequest = new PageRequestImplV3();
  orderStatus: OrderStatus = OrderStatus.ALL;
  beesAccountId?: string;
  deliveryCenterId?: string;
  endDeliveryDate?: string;
  startDeliveryDate?: string;
  orderBy: OrderOrderbyType[] = [OrderOrderbyType.PLACEMENT_DATE];
  orderIds: string[] = [];
  orderStatusCondition: OrderStatusCondition = OrderStatusCondition.INCLUDE;
  sort: SortDirection = SortDirection.DESC;
  updatedSince?: string;
  vendorAccountId?: string;
  vendorId?: string;
  vendorOrderNumber?: string;
  startCreateAt?: string;
  endCreateAt?: string;
  projection: string[] = [];
  returnDeletedOrders?: boolean;

  public toBeesQueryParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const val = this[fieldName];

      if ((typeof val === 'string' && val.trim()) || typeof val === 'boolean') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.push(new BeesParamPayloadImpl(fieldName, this[fieldName]));
      }

      if (Array.isArray(val) && val.length > 0) {
        result.push(new BeesParamPayloadImpl(fieldName, val.join(',')));
      }
    });

    return result;
  }
}
