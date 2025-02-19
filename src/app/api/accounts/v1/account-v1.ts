export interface BeesAccountOwner {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Credit {
  balance?: number;
  overdue?: number;
  available?: number;
  paymentTerms?: string | null;
  total?: number;
  updatedAt?: string;
  consumption?: number;
}

export interface BeesAccountAddress {
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  latitude?: string;
  longitude?: string;
}

export interface DeliveryWindow {
  updatedAt?: string;
  deliveryWindowId?: string;
  deliveryScheduleId?: string;
  startDate?: string;
  endDate?: string;
  expirationDate?: string;
  alternative?: boolean;
  vendorId?: string;
}

export interface SalesRepresentative {
  email?: string;
  name?: string;
  phone?: string;
}

export interface Supervisor {
  email?: string;
  name?: string;
  phone?: string;
}

export interface BeesAccountRepresentative {
  email?: string;
  name?: string;
  phone?: string;
  primary?: boolean;
  productTypes?: string[];
  role?: string;
  supervisor?: Supervisor;
}

export interface TermPeriod {
  days?: number;
}

export interface BeesAccountPaymentTerm {
  type?: string;
  termPeriods?: TermPeriod[];
}

export interface LiquorLicense {
  description?: string;
  expirationDate?: string;
  number?: string;
  status?: string;
  type?: string;
}

export interface BeesAccountMinimumOrder {
  type?: string;
  value?: number;
  paymentMethods?: string[];
}

export interface BeesAccountMaximumOrder {
  type?: string;
  value?: number;
  paymentMethods?: string[];
}

export interface Contact {
  type?: string;
  value?: string;
}

/**
 * @monaco
 * @monaco_include_deps
 */
export interface AccountV1 {
  country: string;
  updatedAt: string;
  accountId: string;
  vendorId: string;
  vendorAccountId: string;
  customerAccountId: string;
  credit?: Credit;
  deliveryAddress?: BeesAccountAddress;
  billingAddress?: BeesAccountAddress;
  deliveryCenterId?: string;
  deliveryScheduleId?: string;
  deliveryWindows?: DeliveryWindow[];
  liquorLicense?: LiquorLicense[];
  name: string;
  owner?: BeesAccountOwner;
  paymentMethods: string[];
  priceListId?: string;
  salesRepresentative?: SalesRepresentative;
  status: string;
  taxId?: string | null;
  paymentTerms?: BeesAccountPaymentTerm[];
  minimumOrder?: BeesAccountMinimumOrder;
  maximumOrder?: BeesAccountMaximumOrder;
  segment?: string;
  channel?: string;
  subSegment?: string;
  erpSalesCenter?: string;
  salesRoute?: string;
  potential?: string;
  deliveryRegion?: string;
  deliveryRoute?: string;
  contacts?: Contact[];
  challengeIds?: string[];
  createdAt?: string;
  legalName?: string;
  displayName?: string;
  timezone?: string;
  representatives?: BeesAccountRepresentative[];
  hasEmptiesLoan?: boolean;
  hasOverprice?: boolean;
  hasPONumberRequirement?: boolean;
  isKeyAccount?: boolean;
}
