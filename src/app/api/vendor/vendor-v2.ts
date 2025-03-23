import { VendorRasType } from './enums/vendor-ras-type';
import { VendorSolutionType } from './enums/vendor-solution-type';
import { VendorInvModelType } from './enums/vendor-inv-model-type';
import { VendorGenericEnabledDisabledEnum } from './enums/vendor-generic-enabled-disabled-enum';
import { VendorOrderLimitType } from './enums/vendor-order-limit-type';
import { VendorPickupOrderStatusManagerType } from './enums/vendor-pickup-order-status-manager-type';
import { VendorFulfilmentCoverageType } from './enums/vendor-fulfilment-coverage-type';
import { VendorAccountTaxIdType } from './enums/vendor-account-tax-id-type';
import { VendorConsumptionType } from './enums/vendor-consumption-type';
import { VendorAlternativeCoverageType } from './enums/vendor-alternative-coverage-type';
import { VendorItemDisplayStrategyType } from './enums/vendor-item-display-strategy.type';
import { VendorDeliveryWindowMethodType } from './enums/vendor-delivery-window-method-type';
import { VendorUserChallengeType } from './enums/vendor-user-challenge-type';
import { VendorSuggestedOrderUseCaseType } from './enums/vendor-suggested-order-use-case-type';
import { VendorRoleType } from './enums/vendor-role-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface VendorV2 {
  vendorId: string;

  legalName: string;

  displayName: string;

  governmentId: string;

  serviceModel: string;

  country: string;

  bccEmails: string[];

  addresses: VendorV2Address[];

  abiVendorId: string;

  vendorParticipation: { [key: string]: any };

  integration: VendorV2Integration;

  configurations: VendorV2Configurations;

  createdAt: string;

  updatedAt: string;

  tier: string;

  thumbnailUrl: string;

  businessModel: string;

  isManufacturer: boolean;

  roles: VendorRoleType[];
}

export interface VendorV2Address {
  type: string;

  address1: string;

  address2: string;

  latitude: string;

  longitude: string;

  city: string;

  state: string;

  zipcode: string;
}

export interface VendorV2Integration {
  ras: VendorRasType;

  params: { [key: string]: any };

  financial: VendorV2FinancialIntegration;
}

export interface VendorV2FinancialIntegration {
  wellsfargo: VendorV2WellsFargoFinancialIntegration;
}

export interface VendorV2WellsFargoFinancialIntegration {
  role: string;

  biller: string;

  nameCompany: string;

  version: string;

  mobileApiKey: string;

  webApiKey: string;

  signature: string;

  pem: string;
}

export interface VendorV2Configurations {
  features: VendorV2FeaturesConfiguration;

  inventory: VendorV2InventoryConfigurations;

  enforcement: VendorV2EnforcementConfigurations;

  orders: VendorV2OrdersConfiguration;

  fulfillment: VendorV2FulfilmentConfiguration;

  pricingEngine: { [key: string]: any };

  account: VendorV2AccountConfiguration;

  items: VendorV2ItemsConfigurations;

  checkout: VendorV2CheckoutConfigurations;

  users: VendorV2UsersConfiguration;

  recommendation: VendorV2RecommendationConfiguration;

  promotions: VendorV2PromotionsConfiguration;
}

export interface VendorV2FeaturesConfiguration {
  erpHandlesIsKeyAccount: boolean;
}

export interface VendorV2InventoryConfigurations {
  keyAccount: VendorV2InventoryConfiguration;

  regularAccount: VendorV2InventoryConfiguration;
}

export interface VendorV2InventoryConfiguration {
  solutionType: VendorSolutionType;

  model: VendorInvModelType;
}

export interface VendorV2EnforcementConfigurations {
  keyAccount: VendorV2EnforcementConfiguration;

  regularAccount: VendorV2EnforcementConfiguration;
}

export interface VendorV2EnforcementConfiguration {
  enabled: boolean;
}

export interface VendorV2OrdersConfiguration {
  empties: VendorGenericEnabledDisabledEnum;

  minimumOrder: VendorV2OrderLimit;

  maximumOrder: VendorV2OrderLimit;

  paymentMethods: string[];

  paymentTerms: VendorV2PaymentTerm[];

  zeroOrder: VendorGenericEnabledDisabledEnum;

  zeroOrderSettings: VendorV2ZeroOrderSettings;

  pickupOrderStatusManager: VendorPickupOrderStatusManagerType;

  upcomingOrderPlacement: VendorGenericEnabledDisabledEnum;

  split: VendorV2Split;
}

export interface VendorV2OrderLimit {
  type: VendorOrderLimitType;

  value: number;

  paymentMethods: string[];
}

export interface VendorV2PaymentTerm {
  termPeriods: VendorV2PaymentTermPeriod[];

  type: string;
}

export interface VendorV2PaymentTermPeriod {
  days: number;
}

export interface VendorV2ZeroOrderSettings {
  emptiesEnabled: boolean;

  redemptionsEnabled: boolean;
}

export interface VendorV2Split {
  redeemable: VendorV2RedeemableSplit;
}

export interface VendorV2RedeemableSplit {
  enabled: boolean;
}

export interface VendorV2FulfilmentConfiguration {
  coverageType: VendorFulfilmentCoverageType;

  acceptedAccountTaxIdTypes: VendorAccountTaxIdType[];

  segments: VendorV2SegmentsFulfilmentConfiguration;

  alternativeCoverageType: VendorAlternativeCoverageType;

  sellToKeyAccounts: boolean;

  alternativeCoverageRestriction: VendorV2AlternativeCoverageRestriction;
}

export interface VendorV2SegmentsFulfilmentConfiguration {
  enabledSegmentedProducts: boolean;

  consumptionTypes: VendorV2SegmentConsumptionType[];
}

export interface VendorV2SegmentConsumptionType {
  type: VendorConsumptionType;

  values: string[];
}

export interface VendorV2AlternativeCoverageRestriction {
  dependsOnContractWithVendor: VendorV2DependsOnContractAlternativeCoverageRestriction;
}

export interface VendorV2DependsOnContractAlternativeCoverageRestriction {
  vendorId: string;

  acceptedSubsegments: string[];
}

export interface VendorV2AccountConfiguration {
  beesAccountCreationEnabled: boolean;

  newContractRegistrationEnabled: boolean;

  newContractRegistration: VendorV2NewContractRegistrationAccountConfiguration;
}

export interface VendorV2NewContractRegistrationAccountConfiguration {
  imageUrl: string;

  helpUrl: string;
}

export interface VendorV2ItemsConfigurations {
  keyAccount: VendorV2ItemsConfiguration;

  regularAccount: VendorV2ItemsConfiguration;
}

export interface VendorV2ItemsConfiguration {
  display: VendorV2ItemsDisplayConfiguration;
}

export interface VendorV2ItemsDisplayConfiguration {
  strategy: VendorItemDisplayStrategyType;
}

export interface VendorV2CheckoutConfigurations {
  keyAccount: VendorV2CheckoutConfiguration;

  regularAccount: VendorV2CheckoutConfiguration;
}

export interface VendorV2CheckoutConfiguration {
  deliveryWindowMethod: VendorDeliveryWindowMethodType;
}

export interface VendorV2UsersConfiguration {
  challenge: VendorV2UsersChallengeConfiguration;
}

export interface VendorV2UsersChallengeConfiguration {
  defaultLanguage: VendorV2UserChallengeLanguage;

  otherLanguages: VendorV2UserChallengeLanguage[];
}

export interface VendorV2UserChallengeLanguage {
  language: string;

  hintUrl: string;

  tip: string;

  fields: VendorV2UserChallengeLanguageField[];
}

export interface VendorV2UserChallengeLanguageField {
  type: VendorUserChallengeType;

  title: string;

  subtitle: string;
}

export interface VendorV2RecommendationConfiguration {
  hasOOSReplacement: boolean;

  hasUpsellEnabled: boolean;

  suggestedOrderUseCase: VendorSuggestedOrderUseCaseType;
}

export interface VendorV2PromotionsConfiguration {
  groupedFreeGoodsEnabled: boolean;
}
