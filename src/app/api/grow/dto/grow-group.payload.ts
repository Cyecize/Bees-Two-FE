import { GrowGroupKpi, GrowGroupMission } from './grow-group';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface GrowGroupPayload {
  name: string;
  color: string;
  description: string;
  dialingMethod: string;
  missions: GrowGroupMission[];
  userIds: string[];
  targetKpi: GrowGroupKpi[];
  vendors: GrowGroupVendorPayload[];
}

export interface GrowGroupVendorPayload {
  id: string;
  segmentations: {
    key: string;
    values: string[];
  }[];
}
