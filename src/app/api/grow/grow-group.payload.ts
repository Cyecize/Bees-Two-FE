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
  vendors: GrowGroupVendor[];
}

export interface GrowGroupMission {
  missionId: string;
  missionKey: string;
  type: string;
}

export interface GrowGroupVendor {
  id: string;
  segmentations: {
    key: string;
    values: string[];
  }[];
}

export interface GrowGroupKpi {
  daily: number;
  invisible: boolean;
  monthly: number;
  type: string;
}
