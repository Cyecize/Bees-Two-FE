import { Category } from '../../category';

export class CategoryItemGroup {
  constructor(
    public category: Category,
    public items: ItemSortOrderPair[],
  ) {}

  public addItem(vendorItemId: string, sortOrder: number): void {
    if (!this.items.find((it) => it.vendorItemId === vendorItemId)) {
      this.items.push({
        vendorItemId: vendorItemId,
        sortOrder: sortOrder,
      });
    }
  }
}

/**
 * @monaco
 */
export interface ItemSortOrderPair {
  vendorItemId: string;
  sortOrder: number;
}
