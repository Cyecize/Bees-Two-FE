import {
  BeesAccountAddress,
  BeesAccountMaximumOrder,
  BeesAccountMinimumOrder,
  BeesAccountOwner,
  BeesAccountPaymentTerm,
  BeesAccountRepresentative,
} from '../v1/account-v1';
import { ContractStatus } from './contract-status';
import { ContractClassificationType } from './contract-classification-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface BeesContract {
  id: string;
  vendorAccountId: string;
  vendorId: string;
  accountId: string;
  legacyAccountId: string;
  customerAccountId: string;
  displayName: string;
  legalName: string;
  deliveryScheduleId: string;
  deliveryCenterId: string;
  taxId: string;
  priceListId: string;
  additionalInformation: any;
  challengeIds: string[];
  channel: string;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: BeesAccountAddress;
  liquorLicense: string[];
  maximumOrder: BeesAccountMaximumOrder;
  minimumOrder: BeesAccountMinimumOrder;
  owner: BeesAccountOwner;
  paymentMethods: string[];
  paymentTerms: BeesAccountPaymentTerm[];
  potential: string;
  representatives: BeesAccountRepresentative[];
  segment: string;
  status: ContractStatus;
  timezone: string;
  classificationType: ContractClassificationType;
  businessAttributes: any[];
  hasEmptiesLoan: boolean;
  hasOverprice: boolean;
  hasPONumberRequirement: boolean;
  isKeyAccount: boolean;
}
