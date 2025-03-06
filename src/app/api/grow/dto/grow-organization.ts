/**
 * @monaco
 * @monaco_include_deps
 */
export interface GrowOrganization {
  active: boolean;
  country: string;
  createdDate: string;
  creatorId: string;
  description: string;
  id: string;
  logoUrl: string;
  name: string;
  updatedDate: string;
  updaterId: string;
  users: GrowOrganizationUser[];
  vendors: GrowOrganizationVendor[];
}

export interface GrowOrganizationVendor {
  id: string;
  name: string;
  serviceModel: string;
}

export interface GrowOrganizationUser {
  groupAllocated: boolean;
  id: string; // Email
  initials: string;
  name: string;
}
