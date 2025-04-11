export interface Container {
  returnable?: boolean;
  name: string;
  itemSize: number;
  size: number;
  unitOfMeasurement: string;
  material: string | null;
  fullContainerDescription: string;
}

export interface Package {
  packageId: string;
  id: string; // Copy of packageId
  unitCount: number;
  count: number; // Copy of Unit count
  itemCount: number;
  name: string;
  materialType?: string;
  pack: string;
  fullPackageDescription: string;
  unitOfMeasurement: string;
  size?: number;
}

/**
 * @monaco
 * @monaco_include_deps
 */
export interface Item {
  id: string;
  brandId: string;
  brandName: string;
  sourceData: ItemSourceData; //Manually created object
  classification: string | null;
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
  name: string; // Copy of itemName
  itemImage: string | null;
  image: string | null; // Copy of itemImage
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
  subBrandName: string | null;
  updatedAt: string;
  vendorId: string;
  manufacturerId?: string;
  styleType: string | null;
  distributorProductType: string | null;
  itemType: string | null;
  vendorItemId: string;
  abv?: number;
  supplier?: string;
  supplierShortName?: string; // Copy of supplier
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
  defaultLanguage: string;
  translations?: { [langCode: string]: ItemTranslation };
}

export interface ItemSourceData {
  vendorItemId: string;
  mfrShortCode?: string;
  mfrItemId?: string;
}

export interface ItemTranslation {
  brandName: string | null;
  classification: string | null;
  container: ItemContainerTranslation;
  distributorProductType: string | null;
  image: string | null;
  itemType: string | null;
  name: string;
  package: ItemPackageTranslation;
  styleType: string | null;
  subBrandName: string | null;
  description: string | null;
}

export class ItemTranslationImpl implements ItemTranslation {
  public package: ItemPackageTranslation;
  constructor(
    public brandName: string | null,
    public classification: string | null,
    public container: ItemContainerTranslation,
    public description: string | null,
    public distributorProductType: string | null,
    public image: string | null,
    public itemType: string | null,
    public name: string,
    pack: ItemPackageTranslation,
    public styleType: string | null,
    public subBrandName: string | null,
  ) {
    this.package = pack;
  }
}

export interface ItemContainerTranslation {
  material: string | null;
  name: string;
  unitOfMeasurement: string;
}

export interface ItemPackageTranslation {
  name: string;
  pack: string | null;
  unitOfMeasurement: string | null;
}
