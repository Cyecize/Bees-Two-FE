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
import { ConcurrentPaginationService } from '../../shared/util/concurrent-pagination.service';

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
  constructor(
    private repository: PriceRepository,
    private concurrentPaginationService: ConcurrentPaginationService,
  ) {}

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
    let failed = 0;

    const resp = await this.concurrentPaginationService.batchAll<
      SingleItemPriceV3,
      Item
    >(
      async (batchNumber, batch) => {
        const queries: SingleItemPriceV3Query[] = batch.map(
          (item: Item) =>
            new SingleItemPriceV3QueryImpl(
              item.itemPlatformId,
              contractId,
              priceListId,
            ),
        );

        console.log(
          `Querying prices for ${batch.length} items for batch ${batchNumber}`,
        );
        const resp = await this.searchPrices(queries, env);

        if (!resp.isSuccess) {
          console.log(resp);
          failed++;
        }

        return {
          items: resp.response.response,
        };
      },
      {
        itemsToBatch: allItems,
        batchSize: 50,
        maxConcurrent: 3,
        abortOnFail: false,
      },
    );

    console.log(
      `Finished price fetching with ${resp.pages} requests and ${failed} errors!`,
    );
    return {
      hasErrors: resp.hasError,
      prices: resp.items,
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
