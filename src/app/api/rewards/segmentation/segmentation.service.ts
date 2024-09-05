import { Injectable } from '@angular/core';
import { SegmentationRepository } from './segmentation.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { BeesResponse } from '../../proxy/bees-response';
import { firstValueFrom } from 'rxjs';
import { SegmentationGroupQuery } from './segmentation-group.query';
import { SegmentationGroupModel } from './segmentation-group.model';
import { SegmentationGroupByAccountSearchResponse } from './segmentation-group-by-account.search-response';
import { SegmentationGroupByAccountQuery } from './segmentation-group-by-account.query';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { SegmentationGroupByAccountModel } from './segmentation-group-by-account.model';

@Injectable({ providedIn: 'root' })
export class SegmentationService {
  constructor(private repository: SegmentationRepository) {}

  public async searchGroups(
    query: SegmentationGroupQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<SegmentationGroupModel[]>> {
    return firstValueFrom(this.repository.searchGroups(query, env?.id));
  }

  public async searchGroupsByAccount(
    query: SegmentationGroupByAccountQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<SegmentationGroupByAccountSearchResponse>> {
    return firstValueFrom(
      this.repository.searchGroupsByAccount(query, env?.id),
    );
  }

  public async getAccountGroup(
    accountId: string,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<SegmentationGroupByAccountModel>> {
    return firstValueFrom(
      this.repository.getGroupsByAccount(accountId, env?.id),
    );
  }

  public async deleteGroup(
    groupId: string,
    authTokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return await new FieldErrorWrapper(() =>
      this.repository.deleteGroup(groupId, authTokenOverride, env?.id),
    ).execute();
  }

  public async deleteAccountGroup(
    accountId: string,
    authTokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return await new FieldErrorWrapper(() =>
      this.repository.deleteAccountGroup(accountId, authTokenOverride, env?.id),
    ).execute();
  }

  public async deleteAccountGroupGroup(
    accountId: string,
    groupId: string,
    authTokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return await new FieldErrorWrapper(() =>
      this.repository.deleteGroupInAccountGroup(
        accountId,
        groupId,
        authTokenOverride,
        env?.id,
      ),
    ).execute();
  }
}
