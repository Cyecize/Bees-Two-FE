import { DealIdType } from '../enums/deal-id-type';
import { DealAccumulationType } from '../enums/deal-accumulation-type';
import { DealType } from '../enums/deal-type';

export interface CreateDealsPayload {
  ids: string[];
  type: DealIdType;
  deals: DealPayload[];
}

export interface DealPayload {
  vendorDealId: string;
  vendorPromotionId: string;
  accumulationType?: DealAccumulationType;
  level?: number;
  priority?: number;
  type?: DealType;
  couponBaseName?: string;
  enforced?: boolean;
  hiddenOnBrowse?: boolean;
  enableVariantGroupingAndConversion?: boolean;

  //TODO: Define those too
  conditions?: any;
  output: any;
}
