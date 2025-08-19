/**
 * @monaco
 */
export interface EnforcementPlatformId {
  vendorId: string;
  vendorAccountId: string | null;
  entity: string; // TODO: replace with enum
  entityId: string;
  vendorDeliveryCenterId: string | null;
}
