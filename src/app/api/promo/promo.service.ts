import { Injectable } from '@angular/core';
import { PromoRepository } from './promo.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesResponse } from '../proxy/bees-response';
import { firstValueFrom } from 'rxjs';
import { PromoSearchQuery, PromoSearchQueryImpl } from './promo-search.query';
import { PromoSearchResponse } from './promo-search.response';
import { PromoV3Payload } from './promo-v3.payload';
import { RelayService } from '../relay/relay.service';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { Promo } from './promo';
import { DEFAULT_PAGE_SIZE } from '../../shared/general.constants';
import { ConcurrentPaginationService } from '../../shared/util/concurrent-pagination.service';

/**
 * @monaco
 */
export interface IPromoService {
  searchPromos(
    query: PromoSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<PromoSearchResponse>>;

  deletePromo(
    promo: Promo,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<any>>;

  addPromo(
    payload: PromoV3Payload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>>;

  fetchAllPromos(
    env: CountryEnvironmentModel,
    limit?: number,
    pageSize?: number,
  ): Promise<Promo[]>;

  newQuery(): PromoSearchQuery;
}

@Injectable({ providedIn: 'root' })
export class PromoService implements IPromoService {
  constructor(
    private promoRepository: PromoRepository,
    private relayService: RelayService,
    private concurrentPaginationService: ConcurrentPaginationService,
  ) {}

  public async searchPromos(
    query: PromoSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<PromoSearchResponse>> {
    return firstValueFrom(this.promoRepository.searchPromos(query, env?.id));
  }

  public async deletePromo(
    promo: Promo,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<any>> {
    return firstValueFrom(
      this.promoRepository.deletePromo(
        [promo.vendorUniqueIds.vendorPromotionId],
        env?.id,
      ),
    );
  }

  public async addPromo(
    payload: PromoV3Payload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<any>(
        BeesEntity.PROMOTIONS,
        RequestMethod.POST,
        RelayVersion.V3,
        [],
        JSON.stringify(payload),
        env?.id,
      ),
    ).execute();
  }

  async fetchAllPromos(
    env: CountryEnvironmentModel,
    limit?: number,
    pageSize?: number,
  ): Promise<Promo[]> {
    if (!pageSize) {
      pageSize = 50; // max page size supported by promo api
    }

    console.log('Fetching all promos!');

    const resp = await this.concurrentPaginationService.fetchAll<Promo>(
      async (pageNum, size) => {
        const query = this.newQuery();
        query.vendorIds = [env.vendorId];
        query.page.pageSize = size;
        query.page.page = pageNum;

        const pageRes = await this.searchPromos(query);
        if (pageRes.statusCode !== 200) {
          console.error('Error during fetching page ' + pageNum);
          console.error(pageRes);
          return {
            hasNext: false,
            items: [],
          };
        }

        return {
          hasNext: pageRes.response.pagination.hasNext,
          items: pageRes.response.promotions,
        };
      },
      {
        limit: limit,
        maxConcurrent: 10,
        pageSize,
      },
    );

    return resp.items;
  }

  public newQuery(): PromoSearchQuery {
    return new PromoSearchQueryImpl();
  }
}
