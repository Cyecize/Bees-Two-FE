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
import { SegmentationGroupPayload } from './segmentation-group.payload';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../proxy/bees-param.payload';
import { BeesMultipartFile } from '../../proxy/bees-multipart-value.payload';

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

  public async upsertGroup(
    payload: SegmentationGroupPayload,
    authTokenOverride: string,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    const headers: BeesParamPayload[] = [];
    headers.push(new BeesParamPayloadImpl('groupName', payload.groupName));

    if (payload.groupId) {
      headers.push(new BeesParamPayloadImpl('groupId', payload.groupId));
    }

    if (payload.groupDescription) {
      headers.push(
        new BeesParamPayloadImpl('groupDescription', payload.groupDescription),
      );
    }

    if (payload.purpose) {
      headers.push(new BeesParamPayloadImpl('purpose', payload.purpose));
    }

    const csvHeaders = 'POC_ID,POINTS,QUANTITY';
    const rows = payload.pocs
      .map((item) => {
        return `${item.pocId},${item.points ?? ''},${item.quantity ?? ''}`;
      })
      .join('\n');

    const base64Content = btoa(`${csvHeaders}\n${rows}`);
    const fileName = 'file.csv';
    const mediaType = 'text/csv';

    return await new FieldErrorWrapper(() =>
      this.repository.upsertGroup(
        headers,
        new BeesMultipartFile(mediaType, fileName, base64Content),
        authTokenOverride,
        env?.id,
      ),
    ).execute();
  }
}
