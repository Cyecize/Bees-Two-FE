export interface Container {
  returnable?: boolean;
  name: string;
  itemSize: number;
  size: number;
  unitOfMeasurement: string;
  material?: string;
  fullContainerDescription: string;
}

export interface Package {
  packageId: string;
  unitCount: number;
  itemCount: number;
  name: string;
  materialType?: string;
  pack: string;
  fullPackageDescription: string;
  unitOfMeasurement: string;
  size?: number;
}

export interface Item {
  id: string;
  brandId: string;
  brandName: string;
  classification?: string;
  container: Container;
  createdDate: string;
  deleted: boolean;
  description: string;
  enabled: boolean;
  hidden?: boolean;
  isAlcoholic?: boolean;
  isNarcotic?: boolean;
  palletQuantity: number;
  itemName: string;
  itemImage?: string;
  minOrderQuantity: number;
  hasBeenUpdated?: boolean;
  ozVolume?: number;
  salesRanking: number;
  uncategorized?: boolean;
  local?: boolean;
  newRelease?: boolean;
  upcCase?: string;
  upcUnit?: string;
  upc?: string;
  sku: string;
  subBrandName?: string;
  updatedAt: string;
  vendorId: string;
  manufacturerId?: string;
  styleType?: string;
  distributorProductType?: string;
  itemType?: string;
  vendorItemId: string;
  abv?: number;
  supplier?: string;
  countryOfOrigin?: string;
  ibu?: number;
  itemPlatformId: string;
  dynamicAttributes?: any;
  variableWeight: boolean;
  agingGroup?: string;
  maxOrderQuantity?: number;
  variant?: boolean;
  casingDescription: string;
  redeemable?: boolean;
  package: Package;
}
