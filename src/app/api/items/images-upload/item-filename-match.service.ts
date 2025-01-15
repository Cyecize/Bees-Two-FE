import { Injectable } from '@angular/core';
import { ItemFilenameMatchType } from './item-filename-match-type';
import { ItemFilenameMatchStrategy } from './item-filename-match-strategy';
import { Item } from '../item';
import { FilenameItemGroup } from './dto/filename-item-group';
import { ItemFilenameMatchResults } from './dto/item-filename-match-results';
import { FilenameUtil } from '../../../shared/util/filename.util';

interface FieldExtractor {
  getValue(item: Item): string;
}

interface ValueComparator {
  test(itemValue: string, fileName: string): boolean;
}

const fieldExtractors = new Map<ItemFilenameMatchType, FieldExtractor>([
  [
    ItemFilenameMatchType.SKU,
    {
      getValue(item: Item): string {
        return item.sku;
      },
    },
  ],
  [
    ItemFilenameMatchType.BEES_ID,
    {
      getValue(item: Item): string {
        return item.id;
      },
    },
  ],
  [
    ItemFilenameMatchType.VENDOR_ITEM_ID,
    {
      getValue(item: Item): string {
        return item.vendorItemId;
      },
    },
  ],
  [
    ItemFilenameMatchType.PLATFORM_ID,
    {
      getValue(item: Item): string {
        return item.itemPlatformId;
      },
    },
  ],
]);

const valueComparators = new Map<ItemFilenameMatchStrategy, ValueComparator>([
  [
    ItemFilenameMatchStrategy.EXACT_MATCH,
    {
      test(itemValue: string, fileName: string): boolean {
        return itemValue === fileName;
      },
    },
  ],
]);

@Injectable({ providedIn: 'root' })
export class ItemFilenameMatchService {
  public match(
    fileNames: string[],
    matchType: ItemFilenameMatchType,
    matchStrategy: ItemFilenameMatchStrategy,
    items: Item[],
  ): ItemFilenameMatchResults {
    if (!fieldExtractors.has(matchType)) {
      throw new Error(`Match type ${matchType} not supported!`);
    }

    if (!valueComparators.has(matchStrategy)) {
      throw new Error(`Match strategy ${matchStrategy} not supported!`);
    }

    const result: FilenameItemGroup[] = [];
    const fileNamesWithNoItems: string[] = [];

    for (const fileName of fileNames) {
      const fileNameNoExtension = FilenameUtil.trimExtension(fileName);
      const matchingItems: Item[] = [];

      for (const item of items) {
        if (
          !valueComparators
            .get(matchStrategy)!
            .test(
              fieldExtractors.get(matchType)!.getValue(item),
              fileNameNoExtension,
            )
        ) {
          continue;
        }

        matchingItems.push(item);
      }

      if (matchingItems.length <= 0) {
        fileNamesWithNoItems.push(fileName);
      } else {
        result.push(new FilenameItemGroup(fileName, matchingItems));
      }
    }

    return {
      filenameGroups: result,
      nonMatchingFileNames: fileNamesWithNoItems,
    };
  }
}
