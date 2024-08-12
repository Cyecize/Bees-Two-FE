import { PromoType } from './promo-type';

export interface PromoV3Payload {
  vendorPromotionId: string;
  title: string;
  description?: string | null;
  type: PromoType;
  startDate: string;
  endDate: string;
  image?: string | null;
  budget?: number | null;
  quantityLimit?: number | null;
  defaultLanguage?: string | null;
}
