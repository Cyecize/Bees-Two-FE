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
    if (!limit) {
      limit = 0;
    }

    if (!pageSize) {
      pageSize = 50; // max page size supported by promo api
    }

    console.log('Fetching all promos!');

    const res = [];

    const query = this.newQuery();
    query.vendorIds = [env.vendorId];
    query.page.pageSize = pageSize;

    let page = 0;
    let hasMore = true;

    while (hasMore) {
      query.page.page = page;

      const pageRes = await this.searchPromos(query);
      if (pageRes.statusCode !== 200) {
        console.error('Error during fetching page ' + page);
        console.error(pageRes);
        return [];
      }

      res.push(...pageRes.response.promotions);
      hasMore = pageRes.response.pagination.hasNext;

      console.log(
        `Fetched ${pageRes.response.promotions.length} promos (${res.length} total).`,
      );

      if (limit > 0 && limit <= res.length) {
        console.log(`Reached the limit of ${limit} - ${res.length}`);
        return res;
      }

      page++;
    }

    return res;
  }

  public newQuery(): PromoSearchQuery {
    return new PromoSearchQueryImpl();
  }
}
