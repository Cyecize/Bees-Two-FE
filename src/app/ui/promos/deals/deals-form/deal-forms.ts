import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DealIdType } from '../../../../api/deals/enums/deal-id-type';
import { DealAccumulationType } from '../../../../api/deals/enums/deal-accumulation-type';
import { DealConditionAmountScope } from '../../../../api/deals/enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from '../../../../api/deals/enums/deal-condition-amount-operator';
import { DealConditionAmountField } from '../../../../api/deals/enums/deal-condition-amount-field';
import { DealDiscountType } from '../../../../api/deals/enums/deal-discount-type';
import { DealComboType } from '../../../../api/deals/enums/deal-combo-type';
import { DealOrderTotalApplyTo } from '../../../../api/deals/enums/deal-order-total-apply-to';

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
  maxQuantityPerUnit: FormControl<number | null>;
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
  enforced: FormControl<boolean | null>;
  enableVariantGroupingAndConversion: FormControl<boolean | null>;
  hiddenOnBrowse: FormControl<boolean | null>;
  hiddenOnDeals: FormControl<boolean | null>;
  conditions: FormGroup<ConditionsForm>;
  output: FormGroup<OutputForm>;
}

export interface ConditionsForm {
  paymentMethod: FormControl<string | null>;
  simulationDateTime?: FormGroup<SimulationDateTimeForm>;
  deliveryDate: FormArray<FormGroup<DeliveryDateForm>>;
  firstOrder: FormControl<boolean | null>;
  couponCode: FormControl<string | null>;
  lineItem?: FormGroup<LineItemConditionForm>;
  multipleLineItem?: FormGroup<MultipleLineItemConditionForm>;
  amounts?: FormArray<FormGroup<AmountConditionForm>>;
}

export interface OutputForm {
  lineItemDiscount?: FormGroup<LineItemDiscountOutput>;
  multipleLineItemDiscount?: FormGroup<MultipleLineItemDiscountOutput>;
  orderTotalScaledDiscount?: FormGroup<OrderTotalScaledDiscountOutputForm>;
  multipleLineItemScaledDiscountByMinimumQuantityAchieved?: FormGroup<MultiItemScaledByMinQtyOutputForm>;
  orderTotalDiscount?: FormGroup<OrderTotalDiscountOutputForm>;
  palletDiscount?: FormGroup<PalletDiscountOutputForm>;
  lineItemScaledDiscount?: FormGroup<LineItemScaledDiscountOutputForm>;
  multipleLineItemScaledDiscount?: FormGroup<MultiLineItemScaledDiscountOutputForm>;
}
