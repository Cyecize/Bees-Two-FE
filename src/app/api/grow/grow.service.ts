import { Injectable } from '@angular/core';
import { GrowRepository } from './grow.repository';
import { GrowOrganization } from './grow-organization';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { GrowOrganizationPayload } from './grow-organization.payload';

/**
 * @monaco
 */
interface IGrowService {
  getOrgs(
    tempToken: string,
    env: CountryEnvironmentModel,
    userEmail?: string,
  ): Promise<WrappedResponse<GrowOrganization[]>>;

  convertOrgToOrgPayload(
    org: GrowOrganization,
  ): GrowOrganizationPayload;

  updateOrg(
    tempToken: string,
    orgId: string,
    env: CountryEnvironmentModel,
    payload: GrowOrganizationPayload,
  ): Promise<WrappedResponse<any>>;
}

@Injectable({ providedIn: 'root' })
export class GrowService implements IGrowService {
  constructor(private growRepository: GrowRepository) {}

  public async getOrgs(
    tempToken: string,
    env: CountryEnvironmentModel,
    userEmail?: string,
  ): Promise<WrappedResponse<GrowOrganization[]>> {
    return await new FieldErrorWrapper(() =>
      this.growRepository.searchOrganizations(userEmail, env.id, tempToken),
    ).execute();
  }

  public convertOrgToOrgPayload(
    org: GrowOrganization,
  ): GrowOrganizationPayload {
    return {
      name: org.name,
      logoUrl: org.logoUrl,
      description: org.description,
      userIds: org.users.map((u) => u.id),
      vendorIds: org.vendors.map((v) => v.id),
    };
  }

  public async updateOrg(
    tempToken: string,
    orgId: string,
    env: CountryEnvironmentModel,
    payload: GrowOrganizationPayload,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.growRepository.putOrganization(orgId, payload, env.id, tempToken),
    ).execute();
  }
}
