import { Injectable } from '@angular/core';
import { SegmentationRepository } from './segmentation.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { BeesResponse } from '../../proxy/bees-response';
import { firstValueFrom } from 'rxjs';
import { SegmentationGroupQuery } from './segmentation-group.query';
import { SegmentationGroupModel } from './segmentation-group.model';
import { SegmentationGroupByAccountSearchResponse } from './segmentation-group-by-account.search-response';
import { SegmentationGroupByAccountQuery } from './segmentation-group-by-account.query';

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
}
