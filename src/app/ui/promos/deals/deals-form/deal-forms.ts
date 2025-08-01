import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DealIdType } from '../../../../api/deals/enums/deal-id-type';
import { DealAccumulationType } from '../../../../api/deals/enums/deal-accumulation-type';
import { DealConditionAmountScope } from '../../../../api/deals/enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from '../../../../api/deals/enums/deal-condition-amount-operator';
import { DealConditionAmountField } from '../../../../api/deals/enums/deal-condition-amount-field';
import { DealDiscountType } from '../../../../api/deals/enums/deal-discount-type';
import { DealComboType } from '../../../../api/deals/enums/deal-combo-type';
import { DealOrderTotalApplyTo } from '../../../../api/deals/enums/deal-order-total-apply-to';
import { DealType } from '../../../../api/deals/enums/deal-type';
import { FixedComboCondition } from '../../../../api/deals/deal';
import { DealRangeTriggerType } from '../../../../api/deals/enums/deal-range-trigger-type';
import { DealManualDiscountApplyTo } from '../../../../api/deals/enums/deal-manual-discount-apply-to';
import { DealChargeType } from '../../../../api/deals/enums/deal-charge-type';

export interface SimulationDateTimeForm {
  startDateTime: FormControl<string>;
  endDateTime: FormControl<string>;
}

export interface DeliveryDateForm {
  startDate: FormControl<string>;
  endDate: FormControl<string | null>;
}

export interface LineItemConditionForm {
  vendorItemIds: FormArray<FormControl<string>>;
  minimumQuantity: FormControl<number | null>;
  minimumAmount: FormControl<number | null>;
  sharedMinimumQuantity: FormControl<boolean | null>;
  crossDiscount: FormControl<boolean | null>;
}

export interface MultipleLineItemConditionForm {
  items: FormArray<FormGroup<MultipleLineItemItemsConditionForm>>;
}

export interface MultipleLineItemItemsConditionForm {
  vendorItemIds: FormArray<FormControl<string>>;
  minimumQuantity: FormControl<number | null>;
  minimumAmount: FormControl<number | null>;
  maxQuantity: FormControl<number | null>;
}

export interface AmountConditionForm {
  scope: FormControl<DealConditionAmountScope>;
  operator: FormControl<DealConditionAmountOperator>;
  field: FormControl<DealConditionAmountField>;
  value: FormControl<number>;
}

export interface LineItemDiscountOutput {
  vendorItemIds: FormArray<FormControl<string>>;
  type: FormControl<DealDiscountType | null>;
  value: FormControl<number | null>;
  maxQuantity: FormControl<number | null>;
  proportion: FormControl<number | null>;
}

export interface MultipleLineItemDiscountOutput {
  proportion: FormControl<number | null>;
  comboType: FormControl<DealComboType | null>;
  type: FormControl<DealDiscountType | null>;
  items: FormArray<FormGroup<MultipleLineItemDiscountOutputItem>>;
}

export interface MultipleLineItemDiscountOutputItem {
  vendorItemId: FormControl<string>;
  value: FormControl<number>;
  maxQuantity: FormControl<number | null>;
}

export interface OrderTotalScaledDiscountOutputForm {
  ranges: FormArray<FormGroup<OrderTotalScaledDiscountOutputRangeForm>>;
}

export interface OrderTotalScaledDiscountOutputRangeForm {
  from: FormControl<number>;
  to: FormControl<number>;
  type: FormControl<DealDiscountType>;
  discount: FormControl<number>;
  applyTo: FormControl<DealOrderTotalApplyTo | null>;
}

export interface MultiItemScaledByMinQtyOutputForm {
  ranges: FormArray<FormGroup<MultiItemScaledByMinQtyOutputRangeForm>>;
}

export interface MultiItemScaledByMinQtyOutputRangeForm {
  from: FormControl<number>;
  to: FormControl<number>;
  type: FormControl<DealDiscountType>;
  value: FormControl<number>;
}

export interface OrderTotalDiscountOutputForm {
  type: FormControl<DealDiscountType>;
  discount?: FormControl<number | null>;
  proportion?: FormControl<number | null>;
  maxAmount?: FormControl<number | null>;
}

export interface PalletDiscountOutputForm {
  discount?: FormControl<number | null>;
  proportion?: FormControl<number | null>;
  measureUnit?: FormControl<string | null>;
}

export interface LineItemScaledDiscountOutputForm {
  vendorItemIds: FormArray<FormControl<string>>;
  ranges: FormArray<FormGroup<LineItemScaledDiscountOutputRangeForm>>;
}

export interface LineItemScaledDiscountOutputRangeForm {
  from: FormControl<number>;
  to: FormControl<number | null>;
  proportion: FormControl<number | null>;
  type: FormControl<DealDiscountType>;
  value: FormControl<number>;
  maxQuantity: FormControl<number | null>;
}

export interface MultiLineItemScaledDiscountOutputForm {
  rangeTriggerType: FormControl<DealRangeTriggerType | null>;
  ranges: FormArray<FormGroup<MultiLineItemScaledDiscountOutputRangeForm>>;
}

export interface MultiLineItemScaledDiscountOutputRangeForm {
  from: FormControl<number>;
  to?: FormControl<number | null>;
  proportion?: FormControl<number | null>;
  type: FormControl<DealDiscountType>;
  items: FormArray<FormGroup<MultiLineItemScaledDiscountOutputRangeItemForm>>;
}

export interface MultiLineItemScaledDiscountOutputRangeItemForm {
  vendorItemId: FormControl<string>;
  value: FormControl<number>;
  maxQuantity?: FormControl<number | null>;
}

export interface FreeGoodOutputForm {
  proportion: FormControl<number | null>;
  proportionAmount: FormControl<number | null>;
  partial: FormControl<boolean | null>;
  items: FormArray<FormGroup<FreeGoodItemForm>>;
}

export interface FreeGoodItemForm {
  quantity: FormControl<number | null>;
  vendorItems: FormArray<FormGroup<FreeGoodItemVendorItemsForm>>;
}

export interface FreeGoodItemVendorItemsForm {
  vendorItemId: FormControl<string>;
  measureUnit: FormControl<string | null>;
  price: FormControl<number | null>;
}

export interface FixedComboConditionForm {
  items: FormArray<FormGroup<FixedComboItemConditionForm>>;
}

export interface FixedComboItemConditionForm {
  vendorItemId: FormControl<string>;
  quantity: FormControl<number>;
}

export interface ScaledFreeGoodsOutputForm {
  partial: FormControl<boolean | null>;
  rangeTriggerType: FormControl<DealRangeTriggerType | null>;
  ranges: FormArray<FormGroup<ScaledFreeGoodsOutputRangeForm>>;
}

export interface ScaledFreeGoodsOutputRangeForm {
  from: FormControl<number>;
  to: FormControl<number | null>;
  proportion: FormControl<number | null>;
  items: FormArray<FormGroup<ScaledFreeGoodOutputRangeItemForm>>;
}

export interface ScaledFreeGoodOutputRangeItemForm {
  quantity: FormControl<number | null>;
  vendorItems: FormArray<FormGroup<FreeGoodItemVendorItemsForm>>;
}

export interface ChargeDiscountOutputForm {
  type: FormControl<DealDiscountType>;
  discountValue: FormControl<number>;
  discountMaximumOrderValue: FormControl<number>;
}

export interface ManualDiscountOutputForm {
  maximum: FormControl<number>;
  type: FormControl<DealDiscountType>;
  applyTo: FormControl<DealManualDiscountApplyTo>;
}

export interface DealsForm {
  ids: FormArray<FormControl<string>>;
  type: FormControl<DealIdType>;
  deals: FormArray<FormGroup<DealForm>>;
}

export interface DealForm {
  vendorDealId: FormControl<string>;
  vendorPromotionId: FormControl<string>;
  accumulationType: FormControl<DealAccumulationType | null>;
  priority: FormControl<number | null>;
  level: FormControl<number | null>;
  score: FormControl<number | null>;
  type: FormControl<DealType | null>;
  personalized: FormControl<boolean | null>;
  enforced: FormControl<boolean | null>;
  enableVariantGroupingAndConversion: FormControl<boolean | null>;
  hiddenOnBrowse: FormControl<boolean | null>;
  hiddenOnDeals: FormControl<boolean | null>;
  conditions: FormGroup<ConditionsForm>;
  output: FormGroup<OutputForm>;
}

export interface ConditionsForm {
  firstOrder: FormControl<boolean | null>;
  couponCode: FormControl<string | null>;
  amounts?: FormArray<FormGroup<AmountConditionForm>>;
  simulationDateTime?: FormGroup<SimulationDateTimeForm>;
  fixedCombo?: FormGroup<FixedComboConditionForm>;
  paymentTerms?: FormArray<FormControl<number>>;
  chargeType?: FormArray<FormControl<DealChargeType>>;
  excludedVendorItemIds?: FormArray<FormControl<string>>;
  paymentMethod: FormControl<string | null>;
  deliveryDate?: FormArray<FormGroup<DeliveryDateForm>>;
  lineItem?: FormGroup<LineItemConditionForm>;
  multipleLineItem?: FormGroup<MultipleLineItemConditionForm>;
}

export interface OutputForm {
  orderTotalDiscount?: FormGroup<OrderTotalDiscountOutputForm>;
  orderTotalScaledDiscount?: FormGroup<OrderTotalScaledDiscountOutputForm>;
  lineItemDiscount?: FormGroup<LineItemDiscountOutput>;
  palletDiscount?: FormGroup<PalletDiscountOutputForm>;
  lineItemScaledDiscount?: FormGroup<LineItemScaledDiscountOutputForm>;
  freeGoods?: FormGroup<FreeGoodOutputForm>;
  scaledFreeGoods?: FormGroup<ScaledFreeGoodsOutputForm>;
  multipleLineItemDiscount?: FormGroup<MultipleLineItemDiscountOutput>;
  // fixedCombo?: any; // Fixed combo output is missing from developer portal
  multipleLineItemScaledDiscount?: FormGroup<MultiLineItemScaledDiscountOutputForm>;
  multipleLineItemScaledDiscountSkuPool?: FormGroup<MultiItemScaledByMinQtyOutputForm>;
  chargeDiscount?: FormGroup<ChargeDiscountOutputForm>;
  manualDiscount?: FormGroup<ManualDiscountOutputForm>;
}
