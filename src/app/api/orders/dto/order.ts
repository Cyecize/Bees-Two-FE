import { OrderStatus } from '../order.status';

export interface Order {
  orderNumber: string;
  beesAccountId: string;
  placementDate: string;
  status: OrderStatus;
  previousStatus: OrderStatus | null;
  channel: string;
  audit: any;
  delivery: any;
  cancellation?: any;
  combos: any[];
  fee?: any;
  location?: any;
  empties: any;
  items: any[];
  messages: any[];
  orderGenericInfo: any;
  payment: any;
  payments: any;
  invoicing: any;
  actionReason: any[];
  summary: any;
  vendor: OrderVendorData;
  orderProperties: any[];
  deleted: boolean;
  purchaseId?: number;
}

export interface OrderVendorData {
  id: string;
  accountId: string;
  orderNumber?: string;
}
