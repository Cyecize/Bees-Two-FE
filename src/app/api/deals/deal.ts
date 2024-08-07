import { DealOutputType } from './enums/deal-output-type';
import { DealAccumulationType } from './enums/deal-accumulation-type';
import { DealConditionAmountScope } from './enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from './enums/deal-condition-amount-operator';
import { DealConditionAmountField } from './enums/deal-condition-amount-field';
import { DealDiscountType } from './enums/deal-discount-type';
import { DealComboType } from './enums/deal-combo-type';
import { DealOrderTotalApplyTo } from './enums/deal-order-total-apply-to';

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

export interface LineItemOutput {
  vendorItemIds: string[];
  type: DealDiscountType;
  value: number;
  maxQuantity?: number;
  proportion?: number;
}

export interface MultipleLineItemOutput {
  type: DealDiscountType;
  items: MultipleLineItemOutputItem[];
  proportion?: number;
  comboType?: DealComboType;
}

export interface MultipleLineItemOutputItem {
  vendorItemId: string;
  value: number;
  maxQuantity?: number;
}

export interface OrderTotalScaledDiscountOutput {
  ranges: OrderTotalScaledDiscountOutputRange[];
}

export interface OrderTotalScaledDiscountOutputRange {
  from: number;
  to: number;
  type: DealDiscountType;
  discount: number;
  applyTo: DealOrderTotalApplyTo;
}

export interface MultiItemScaledByMinQtyOutput {
  ranges: MultiItemScaledByMinQtyOutputRange[];
}

export interface MultiItemScaledByMinQtyOutputRange {
  from: number;
  to: number;
  type: DealDiscountType;
  value: number;
}

export interface OrderTotalDiscountOutput {
  type: DealDiscountType;
  discount?: number;
  proportion?: number;
  maxAmount?: number;
}

export interface PalletDiscountOutput {
  discount?: number;
  proportion?: number;
  measureUnit?: string;
}

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
  output: DealOutput;
}

export interface DealConditions {
  //TODO: Define all fields
  lineItem?: LineItemDealCondition;
  simulationDateTime?: SimulationDateTimeCondition;
  deliveryDate?: DeliveryDateCondition[];
  amounts?: AmountCondition[];
  multipleLineItem?: MultipleLineItemCondition;
}

export interface DealOutput {
  lineItemDiscount?: LineItemOutput;
  multipleLineItemDiscount?: MultipleLineItemOutput;
  orderTotalScaledDiscount?: OrderTotalScaledDiscountOutput;
  multipleLineItemScaledDiscountByMinimumQuantityAchieved?: MultiItemScaledByMinQtyOutput;
  orderTotalDiscount?: OrderTotalDiscountOutput;
  palletDiscount?: PalletDiscountOutput;
}
