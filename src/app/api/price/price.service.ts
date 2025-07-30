import { PriceRepository } from './price.repository';
import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import {
  SingleItemPriceV3Query,
  SingleItemPriceV3QueryImpl,
} from './single-item-price-v3.query';
import { SingleItemPriceV3 } from './single-item-price-v3';
import { map } from 'rxjs/operators';
import { ObjectUtils } from '../../shared/util/object-utils';
import { Item } from '../items/item';
import { ArrayUtils } from '../../shared/util/array-utils';
import { SearchAllPricesResponse } from './search-all-prices.response';

/**
 * @monaco
 */
export interface IPriceService {
  searchPrices(
    queries: SingleItemPriceV3Query[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<SingleItemPriceV3[]>>;

  fetchAllPrices(
    allItems: Item[],
    contractId: string,
    priceListId: string,
    env?: CountryEnvironmentModel,
  ): Promise<SearchAllPricesResponse>;

  newQuery(
    itemId: string,
    contractId: string,
    priceListId: string,
  ): SingleItemPriceV3Query;
}

@Injectable({ providedIn: 'root' })
export class PriceService implements IPriceService {
  constructor(private repository: PriceRepository) {}

  public async searchPrices(
    queries: SingleItemPriceV3Query[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<SingleItemPriceV3[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.getPrices(queries, env?.id).pipe(
        map((res) => {
          if (ObjectUtils.isNil(res.response)) {
            res.response = [];
          }

          return res;
        }),
      ),
    ).execute();
  }

  public async fetchAllPrices(
    allItems: Item[],
    contractId: string,
    priceListId: string,
    env?: CountryEnvironmentModel,
  ): Promise<SearchAllPricesResponse> {
    const allPrices: SingleItemPriceV3[] = [];

    let failed = 0;
    let batchNum = 0;
    const batchSize = 50;
    for (const itemBatch of ArrayUtils.splitToBatches(allItems, batchSize)) {
      const queries: SingleItemPriceV3Query[] = itemBatch.map(
        (item: Item) =>
          new SingleItemPriceV3QueryImpl(
            item.itemPlatformId,
            contractId,
            priceListId,
          ),
      );

      console.log(
        `Querying prices for ${itemBatch.length} items of batch ${batchNum}`,
      );
      const resp = await this.searchPrices(queries, env);

      if (!resp.isSuccess) {
        console.log(resp);
        failed++;
      } else {
        allPrices.push(...resp.response.response);
      }

      batchNum++;
    }

    if (failed > 0) {
      alert(
        `Search finished with ${failed} failed batch requests, check the logs!`,
      );

      return {
        hasErrors: true,
        prices: allPrices,
      };
    }

    return {
      hasErrors: false,
      prices: allPrices,
    };
  }

  public newQuery(
    itemId: string,
    contractId: string,
    priceListId: string,
  ): SingleItemPriceV3Query {
    return new SingleItemPriceV3QueryImpl(itemId, contractId, priceListId);
  }
}
