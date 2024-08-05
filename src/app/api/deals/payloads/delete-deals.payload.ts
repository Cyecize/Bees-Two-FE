import { DealIdType } from '../enums/deal-id-type';

export interface DeleteDealsPayload {
  ids?: string[];
  type?: DealIdType;
  vendorDealIds: string[];
}

export class DeleteSingleVendorDealIdPayload implements DeleteDealsPayload {
  vendorDealIds: string[];

  constructor(dealId: string) {
    this.vendorDealIds = [dealId];
  }
}

//TODO: add more payload variations
