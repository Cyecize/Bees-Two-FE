import { DealOutputType } from './enums/deal-output-type';

export interface Deal {
  deliveryCenterId?: string;
  contractId: string;
  vendorDealId: string;
  vendorPromotionId: string;
  accumulationType?: string;
  priority?: number;
  level?: number;
  timezone: string;
  vendorId: string;
  hiddenOnBrowse: boolean;
  dealType: DealOutputType;
  enforced: boolean;
  enableVariantGroupingAndConversion: boolean;
  conditions: any; // TODO: Define conditions
  output: any; // TODO: Define output
}
