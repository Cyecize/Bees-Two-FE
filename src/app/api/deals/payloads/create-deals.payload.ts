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
  accumulationType?: DealAccumulationType | null;
  level?: number | null;
  priority?: number | null;
  type?: DealType | null;
  couponBaseName?: string | null;
  enforced?: boolean | null;
  hiddenOnBrowse?: boolean | null;
  enableVariantGroupingAndConversion?: boolean | null;

  //TODO: Define those too
  conditions?: any;
  output: any;
}
