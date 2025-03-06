/**
 * @monaco
 */
export interface GrowUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
  country: string;
  vendorId: string;
  missionPriority: string[];
  segmentation: string[];
  orgId?: string;
}
