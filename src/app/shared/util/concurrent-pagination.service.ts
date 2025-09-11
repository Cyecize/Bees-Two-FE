import { Injectable } from '@angular/core';
import { ArrayUtils } from './array-utils';

/**
 * @monaco
 */
interface PaginatedResponse<T> {
  items: T[];
  hasNext: boolean;
  hasError?: boolean;
}

/**
 * @monaco
 */
interface BatchedResponse<T> {
  items: T[];
  hasError?: boolean;
}

/**
 * @monaco
 */
interface PaginationOptions {
  pageSize?: number;
  limit?: number;
  startingPage?: number;
  maxConcurrent?: number;
  abortOnFail?: boolean;
}

/**
 * @monaco
 */
interface BatchOptions<T> {
  maxConcurrent?: number;
  abortOnFail?: boolean;
  itemsToBatch?: T[];
  batchSize?: number;
}

/**
 * @monaco
 */
export interface ConcurrentPaginationResponse<T> {
  items: T[];
  hasError: boolean;
  pages: number;
}

/**
 * @monaco
 */
export interface IConcurrentPaginationService {
  batchAll<TResponse, TBatch>(
    fetcher: (
      batchNumber: number,
      batch: TBatch[],
    ) => Promise<BatchedResponse<TResponse>>,
    options: BatchOptions<TBatch>,
  ): Promise<ConcurrentPaginationResponse<TResponse>>;

  fetchAll<T>(
    fetcher: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>,
    options: PaginationOptions,
  ): Promise<ConcurrentPaginationResponse<T>>;
}

interface PageResults<T> {
  pageNumber: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class ConcurrentPaginationService
  implements IConcurrentPaginationService
{
  public async batchAll<TResponse, TBatch>(
    fetcher: (
      batchNumber: number,
      batch: TBatch[],
    ) => Promise<BatchedResponse<TResponse>>,
    options: BatchOptions<TBatch> = {},
  ): Promise<ConcurrentPaginationResponse<TResponse>> {
    const {
      batchSize = 50,
      maxConcurrent = 5,
      abortOnFail = true,
      itemsToBatch = [],
    } = options;

    if (!itemsToBatch.length) {
      return {
        items: [],
        hasError: false,
        pages: 0,
      };
    }

    const batchedItems = ArrayUtils.splitToBatches(itemsToBatch, batchSize);
    const batchesByConcurrentCalls = ArrayUtils.splitToBatches(
      batchedItems,
      maxConcurrent,
    );

    let returnResults = true;
    const items: TResponse[] = [];

    let batchNumber = 0;
    for (const batches of batchesByConcurrentCalls) {
      const pendingPromises: Promise<void>[] = [];
      for (const batch of batches) {
        const resp = this.fetchAll<TResponse>(
          async (page, pageSize) => {
            const res = await fetcher(batchNumber, batch);
            return {
              items: res.items,
              hasNext: false,
              hasError: res.hasError,
            };
          },
          {
            pageSize: batchSize,
            maxConcurrent: 1,
            abortOnFail: abortOnFail,
          },
        ).then((value) => {
          if (value.hasError && abortOnFail) {
            returnResults = false;
          }

          if (!value.hasError) {
            items.push(...value.items);
          }
        });

        pendingPromises.push(resp);
        batchNumber++;
      }

      await Promise.allSettled(pendingPromises);
    }

    if (returnResults) {
      return {
        items: items,
        hasError: false,
        pages: batchedItems.length,
      };
    }

    return {
      items: [],
      hasError: true,
      pages: 0,
    };
  }

  public async fetchAll<T>(
    fetcher: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>,
    options: PaginationOptions = {},
  ): Promise<ConcurrentPaginationResponse<T>> {
    const {
      pageSize = 50,
      limit = 0,
      maxConcurrent = 5,
      startingPage = 0,
      abortOnFail = true,
    } = options;

    let totalItems = 0;
    const pageResults: PageResults<T>[] = [];

    const addResult = (pageNumber: number, items: T[]): void => {
      pageResults.push({
        items: items,
        pageNumber: pageNumber,
      });
      totalItems += items.length;
    };

    let currentPage = startingPage;
    let highestPage = startingPage;
    let hasNext = true;
    let returnResults = true;
    const pendingPromises: Promise<void>[] = [];

    while (hasNext && (totalItems < limit || limit <= 0)) {
      const pagePromises: Promise<void>[] = [];

      // Create a batch of concurrent requests
      for (
        let i = 0;
        i < maxConcurrent && hasNext && (totalItems < limit || limit <= 0);
        i++
      ) {
        const page = currentPage;
        const promise = fetcher(page, pageSize)
          .then((response) => {
            if (!response.hasError) {
              if (limit > 0) {
                response.items = response.items.slice(0, limit - totalItems);
              }

              addResult(page, response.items);

              highestPage = Math.max(page, highestPage);
              if (!response.hasNext) {
                hasNext = false;
              }
            } else {
              hasNext = false;
              if (abortOnFail) {
                returnResults = false;
              }
            }
          })
          .catch((error) => {
            console.error(`Error fetching page ${page}:`, error);
            hasNext = false;
            if (abortOnFail) {
              returnResults = false;
            }
          });
        pagePromises.push(promise);
        currentPage++;
      }

      // Wait for the entire batch to complete
      await Promise.allSettled(pagePromises);

      console.log(`Fetched ${maxConcurrent} pages, total items: ${totalItems}`);

      pendingPromises.push(...pagePromises);
    }

    if (returnResults) {
      return {
        items: pageResults
          .sort((a, b) => a.pageNumber - b.pageNumber)
          .flatMap((val) => val.items),
        hasError: false,
        pages: highestPage,
      };
    }

    return {
      items: [],
      hasError: true,
      pages: 0,
    };
  }
}
