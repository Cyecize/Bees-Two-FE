import { CategoryItemPair } from './category-item-pair';
import { CategoryItemGroup } from './category-item-group';

export class CategoryItemMatchResult {
  constructor(
    public nonMatchingPairs: CategoryItemPair[],
    public categoryItemGroups: CategoryItemGroup[],
  ) {}
}
