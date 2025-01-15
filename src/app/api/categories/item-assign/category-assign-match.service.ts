import { Injectable } from '@angular/core';
import { Category } from '../category';
import { CategoryAssignMatchType } from './category-assign-match-type';
import { CategoryWithParent } from '../category-with-parent';
import { CategoryItemMatchResult } from './dto/category-item-match-result';
import { CategoryItemPair } from './dto/category-item-pair';
import { CategoryItemGroup } from './dto/category-item-group';

interface FieldExtractor {
  getValue(category: CategoryWithParent): string;
}

const fieldExtractors = new Map<CategoryAssignMatchType, FieldExtractor>([
  [
    CategoryAssignMatchType.ID,
    {
      getValue(category: CategoryWithParent): string {
        return category.id;
      },
    },
  ],
  [
    CategoryAssignMatchType.NAME_TREE,
    {
      getValue(category: CategoryWithParent): string {
        if (!category) {
          return '';
        }
        return (
          this.getValue(category.parent!) +
          `${category.parent ? '__' : ''}${category.name}`
        );
      },
    },
  ],
  [
    CategoryAssignMatchType.STORE_CATEGORY_ID,
    {
      getValue(category: CategoryWithParent): string {
        return category.storeCategoryId || '';
      },
    },
  ],
]);

@Injectable({ providedIn: 'root' })
export class CategoryAssignMatchService {
  public match(
    pairs: CategoryItemPair[],
    flatCategories: CategoryWithParent[],
    matchType: CategoryAssignMatchType,
  ): CategoryItemMatchResult {
    const nonMatchingPairs: CategoryItemPair[] = [];
    const groupsMap = new Map<string, CategoryItemGroup>();
    const categoriesMap = new Map<string, Category>();

    const extractor = fieldExtractors.get(matchType)!;
    for (const cat of flatCategories) {
      categoriesMap.set(extractor.getValue(cat).toLowerCase(), cat);
    }

    for (const pair of pairs) {
      const cat = categoriesMap.get(pair.category.toLowerCase());
      if (!cat) {
        nonMatchingPairs.push(pair);
        continue;
      }

      if (!groupsMap.has(cat.id)) {
        groupsMap.set(cat.id, new CategoryItemGroup(cat, []));
      }

      groupsMap.get(cat.id)!.addItem(pair.vendorItemId, pair.sortOrder);
    }

    return new CategoryItemMatchResult(nonMatchingPairs, [
      ...groupsMap.values(),
    ]);
  }
}
