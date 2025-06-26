import { PromoType } from './promo-type';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface Promo {
  description: string;
  endDate: string;
  image: string;
  platformUniqueIds: PromoPlatformUniqueIds;
  startDate: string;
  title: string;
  type: PromoType;
  vendorUniqueIds: VendorUniqueIds;
}

export interface PromoPlatformUniqueIds {
  promotionId: string;
  promotionPlatformId: string;
}

export interface VendorUniqueIds {
  vendorId: string;
  vendorPromotionId: string;
}
