export interface CategoryItemPair {
  category: string;
  vendorItemId: string;
  sortOrder: number;
}

export class CategoryItemPairImpl implements CategoryItemPair {
  constructor(
    public category: string,
    public vendorItemId: string,
    public sortOrder: number,
  ) {}
}
