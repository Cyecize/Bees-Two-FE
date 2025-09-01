import { CategoryImage } from './models/category-image';
import { CategoryItem } from './models/category-item';
import { CategoryGroupType } from './category-group.type';
import { CategoryTranslation } from './models/category-translation';

/**
 * @monaco
 */
export interface CategoryV3Payload {
  enabled: boolean;
  sortOrder: number;
  parentId?: string;
  restricted?: string[];
  items?: CategoryItem[];
  name: string;
  link?: string;
  image?: CategoryImage;
  imageAltText?: string;
  translations?: { [langCode: string]: CategoryTranslation };
  groups?: CategoryGroupType[];
  storeCategoryId?: string;
}
