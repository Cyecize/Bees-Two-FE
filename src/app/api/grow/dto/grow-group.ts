/**
 * @monaco
 * @monaco_include_deps
 */
export interface GrowGroup {
  id: string;
  color: string;
  country: string;
  createdDate: string;
  creatorId: string;
  description: string;
  dialingMethod: string;
  missions: GrowGroupMission[];
  name: string;
  organization: {
    active: boolean;
    id: string;
  };
  targetKpi: GrowGroupKpi[];
  updatedDate: string;
  updaterId: string;
  users: GrowGroupUser[];
  vendors: GrowGroupVendor[];
}

export interface GrowGroupMission {
  missionId: string;
  missionKey: string;
  type: string;
}

export interface GrowGroupKpi {
  daily: number;
  invisible: boolean;
  monthly: number;
  type: string;
}

export interface GrowGroupUser {
  id: string;
  initials: string;
  name: string;
}

export interface GrowGroupVendor {
  id: string;
  name: string;
  segmentations: {
    key: string;
    values: string[];
  }[];
}
