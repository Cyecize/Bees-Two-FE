import { Injectable } from '@angular/core';
import { CategoryFilenameMatchType } from './category-filename-match-type';
import { CategoryFilenameMatchStrategy } from './category-filename-match-strategy';
import { FilenameCategoryGroup } from './dto/filename-category-group';
import { CategoryFilenameMatchResults } from './dto/category-filename-match-results';
import { Category } from '../category';
import { FilenameUtil } from '../../../shared/util/filename.util';

interface FieldExtractor {
  getValue(category: Category): string;
}

interface ValueComparator {
  test(value: string, fileName: string): boolean;
}

const fieldExtractors = new Map<CategoryFilenameMatchType, FieldExtractor>([
  [
    CategoryFilenameMatchType.ID,
    {
      getValue(category: Category): string {
        return category.id;
      },
    },
  ],
  [
    CategoryFilenameMatchType.NAME,
    {
      getValue(category: Category): string {
        return category.name;
      },
    },
  ],
  [
    CategoryFilenameMatchType.STORE_CATEGORY_ID,
    {
      getValue(category: Category): string {
        return category.storeCategoryId || '';
      },
    },
  ],
]);

const valueComparators = new Map<
  CategoryFilenameMatchStrategy,
  ValueComparator
>([
  [
    CategoryFilenameMatchStrategy.EXACT_MATCH,
    {
      test(val: string, fileName: string): boolean {
        return val === fileName;
      },
    },
  ],
  [
    CategoryFilenameMatchStrategy.CATEGORY_CONTAINS,
    {
      test(val: string, fileName: string): boolean {
        return val.includes(fileName);
      },
    },
  ],
  [
    CategoryFilenameMatchStrategy.CATEGORY_STARTS_WITH,
    {
      test(val: string, fileName: string): boolean {
        return val.startsWith(fileName);
      },
    },
  ],
  [
    CategoryFilenameMatchStrategy.FILENAME_STARTS_WITH,
    {
      test(val: string, fileName: string): boolean {
        return fileName.startsWith(val);
      },
    },
  ],
  [
    CategoryFilenameMatchStrategy.FILENAME_CONTAINS,
    {
      test(val: string, fileName: string): boolean {
        return fileName.includes(val);
      },
    },
  ],
]);

@Injectable({ providedIn: 'root' })
export class CategoryFilenameMatchService {
  public match(
    fileNames: string[],
    matchType: CategoryFilenameMatchType,
    matchStrategy: CategoryFilenameMatchStrategy,
    categories: Category[],
  ): CategoryFilenameMatchResults {
    if (!fieldExtractors.has(matchType)) {
      throw new Error(`Match type ${matchType} not supported!`);
    }

    if (!valueComparators.has(matchStrategy)) {
      throw new Error(`Match strategy ${matchStrategy} not supported!`);
    }

    const result: FilenameCategoryGroup[] = [];
    const fileNamesWithNoCategories: string[] = [];

    for (const fileName of fileNames) {
      const fileNameNoExtension =
        FilenameUtil.trimExtension(fileName)?.toLowerCase();

      const matchingCategories: Category[] = [];

      for (const category of categories) {
        if (
          !valueComparators
            .get(matchStrategy)!
            .test(
              fieldExtractors.get(matchType)!.getValue(category).toLowerCase(),
              fileNameNoExtension,
            )
        ) {
          continue;
        }

        matchingCategories.push(category);
      }

      if (matchingCategories.length <= 0) {
        fileNamesWithNoCategories.push(fileName);
      } else {
        result.push(new FilenameCategoryGroup(fileName, matchingCategories));
      }
    }

    return {
      filenameGroups: result,
      nonMatchingFileNames: fileNamesWithNoCategories,
    };
  }
}
