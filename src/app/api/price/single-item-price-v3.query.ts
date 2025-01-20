export interface SingleItemPriceV3Query {
  // Platform ID
  itemId: string;

  // Platform ID
  contractId: string;
  priceListId: string;
}

export class SingleItemPriceV3QueryImpl implements SingleItemPriceV3Query {
  constructor(
    public itemId: string,
    public contractId: string,
    public priceListId: string,
  ) {}
}
