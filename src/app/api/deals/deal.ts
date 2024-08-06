import { DealOutputType } from './enums/deal-output-type';
import { DealAccumulationType } from './enums/deal-accumulation-type';
import { DealConditionAmountScope } from './enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from './enums/deal-condition-amount-operator';
import { DealConditionAmountField } from './enums/deal-condition-amount-field';

export interface Deal {
  deliveryCenterId?: string;
  contractId: string;
  vendorDealId: string;
  vendorPromotionId: string;
  accumulationType?: DealAccumulationType;
  priority?: number;
  level?: number;
  timezone: string;
  vendorId: string;
  hiddenOnBrowse: boolean;
  hiddenOnDeals: boolean;
  dealType: DealOutputType;
  enforced: boolean;
  enableVariantGroupingAndConversion: boolean;
  conditions?: DealConditions;
  output: any; // TODO: Define output
}

export interface DealConditions {
  //TODO: Define all fields
  lineItem?: LineItemDealCondition;
  simulationDateTime?: SimulationDateTimeCondition;
  deliveryDate?: DeliveryDateCondition[];
  amounts?: AmountCondition[];
  multipleLineItem?: MultipleLineItemCondition;
}

export interface LineItemDealCondition {
  vendorItemIds: string[];
  minimumQuantity?: number;
  sharedMinimumQuantity?: boolean;
  crossDiscount?: boolean;
}

export interface SimulationDateTimeCondition {
  endDateTime: string;
  startDateTime: string;
}

export interface DeliveryDateCondition {
  startDate: string;
  endDate?: string;
}

export interface AmountCondition {
  scope: DealConditionAmountScope;
  operator: DealConditionAmountOperator;
  field: DealConditionAmountField;
  value: number;
}

export interface MultipleLineItemCondition {
  items: MultipleLineItemItemCondition[];
}

export interface MultipleLineItemItemCondition {
  vendorItemIds: string[];
  minimumQuantity?: number;
  minimumAmount?: number;
}
