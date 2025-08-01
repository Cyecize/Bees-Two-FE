import { DealOutputType } from './enums/deal-output-type';
import { DealAccumulationType } from './enums/deal-accumulation-type';
import { DealConditionAmountScope } from './enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from './enums/deal-condition-amount-operator';
import { DealConditionAmountField } from './enums/deal-condition-amount-field';
import { DealDiscountType } from './enums/deal-discount-type';
import { DealComboType } from './enums/deal-combo-type';
import { DealOrderTotalApplyTo } from './enums/deal-order-total-apply-to';
import { DealRangeTriggerType } from './enums/deal-range-trigger-type';
import { DealManualDiscountApplyTo } from './enums/deal-manual-discount-apply-to';
import { DealType } from './enums/deal-type';
import { DealChargeType } from './enums/deal-charge-type';

export interface LineItemDealCondition {
  vendorItemIds: string[];
  minimumQuantity?: number;
  minimumAmount?: number;
  sharedMinimumQuantity?: boolean;
  crossDiscount?: boolean;
  multipleConditionItems: boolean;
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

export interface FixedComboItemsCondition {
  vendorItemId: string;
  quantity: number;
}

export interface FixedComboCondition {
  items: FixedComboItemsCondition[];
}

export interface MultipleLineItemCondition {
  items: MultipleLineItemItemCondition[];
}

export interface MultipleLineItemItemCondition {
  vendorItemIds: string[];
  minimumQuantity?: number;
  minimumAmount?: number;
  maxQuantity?: number;
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

export interface LineItemScaledDiscountOutput {
  vendorItemIds: string[];
  ranges: LineItemScaledDiscountOutputRange[];
}

export interface LineItemScaledDiscountOutputRange {
  from: number;
  to?: number;
  proportion?: number;
  type: DealDiscountType;
  value: number;
  maxQuantity?: number;
}

export interface MultiLineItemScaledDiscountOutput {
  rangeTriggerType: DealRangeTriggerType;
  ranges: MultiLineItemScaledDiscountOutputRange[];
}

export interface MultiLineItemScaledDiscountOutputRange {
  from: number;
  to?: number;
  proportion?: number;
  type: DealDiscountType;
  items: MultiLineItemScaledDiscountOutputRangeItem[];
}

export interface MultiLineItemScaledDiscountOutputRangeItem {
  vendorItemId: string;
  value: number;
  maxQuantity?: number;
}

export interface FreeGoodOutput {
  proportion: number;
  proportionAmount: number;
  partial: boolean;
  items: FreeGoodOutputItem[];
}

export interface ScaledFreeGoodOutput {
  rangeTriggerType: DealRangeTriggerType;
  partial: boolean;
  ranges: LineItemScaledFreeGoodsRange[];
}

export interface LineItemScaledFreeGoodsRange {
  from: number;
  to?: number;
  proportion?: number;
  items: FreeGoodOutputItem[];
}

export interface FreeGoodOutputItem {
  quantity: number;
  vendorItems: FreeGoodOutputItemVendorItem[];
}

export interface FreeGoodOutputItemVendorItem {
  vendorItemId: string;
  measureUnit: string;
  price: number;
}

export interface FixedComboOutput {
  price: number;
  originalPrice: number;
  type: DealDiscountType;
  value: number;
  items: FixedComboItemOutput[];
  freeGoods: FixedComboFreeGoodOutput[];
}

export interface FixedComboItemOutput {
  vendorItemId: number;
  vendorComboItemId: number;
  price: number;
}

export interface FixedComboFreeGoodOutput {
  vendorItemId: string;
  vendorComboItemId: string;
  price: number;
  quantity: number;
  measureUnit: string;
}

export interface ChargeDiscountOutput {
  type: DealDiscountType;
  discountValue: number;
  discountMaximumOrderValue: number;
}

export interface ManualDiscountOutput {
  maximum: number;
  type: DealDiscountType;
  applyTo: DealManualDiscountApplyTo;
}

/**
 * @monaco
 * @monaco_include_deps
 */
export interface Deal {
  deliveryCenterId?: string;
  contractId: string;
  vendorDealId: string;
  vendorPromotionId: string;
  accumulationType?: DealAccumulationType;
  priority?: number;
  level?: number;
  score?: number;
  personalized?: boolean;
  timezone: string;
  vendorId: string;
  hiddenOnBrowse: boolean;
  hiddenOnDeals: boolean;
  dealType: DealOutputType;
  enforced: boolean;
  enableVariantGroupingAndConversion: boolean;
  conditions?: DealConditions;
  output: DealOutput;
  type?: DealType;
  deletedAt?: string;
}

export interface DealConditions {
  paymentMethod?: string;
  paymentTerms?: number[];
  lineItem?: LineItemDealCondition;
  simulationDateTime?: SimulationDateTimeCondition;
  deliveryDate?: DeliveryDateCondition[];
  amounts?: AmountCondition[];
  multipleLineItem?: MultipleLineItemCondition;
  couponCode?: string;
  firstOrder?: boolean;
  fixedCombo?: FixedComboCondition;
  chargeType?: DealChargeType[];
  excludedVendorItemIds?: string[];
}

export interface DealOutput {
  lineItemDiscount?: LineItemOutput;
  lineItemScaledDiscount?: LineItemScaledDiscountOutput;
  multipleLineItemDiscount?: MultipleLineItemOutput;
  orderTotalScaledDiscount?: OrderTotalScaledDiscountOutput;
  multipleLineItemScaledDiscountSkuPool?: MultiItemScaledByMinQtyOutput;
  orderTotalDiscount?: OrderTotalDiscountOutput;
  palletDiscount?: PalletDiscountOutput;
  multipleLineItemScaledDiscount?: MultiLineItemScaledDiscountOutput;
  freeGoods?: FreeGoodOutput;
  scaledFreeGoods?: ScaledFreeGoodOutput;
  fixedCombo?: FixedComboOutput;
  chargeDiscount?: ChargeDiscountOutput;
  manualDiscount?: ManualDiscountOutput;
}
