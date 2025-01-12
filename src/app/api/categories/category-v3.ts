import { CategoryImage } from './models/category-image';
import { CategoryItem } from './models/category-item';
import { CategoryTranslation } from './models/category-translation';

export interface CategoryV3 {
  id: string;
  storeCategoryId?: string;
  name: string;
  categoryLevel: number;
  enabled: boolean;
  items?: CategoryItem[];
  categories?: CategoryV3[];
  groups: string[];
  image: CategoryImage;
  imageAltText: string;
  link: string;
  parentId?: string;
  restricted: string[];
  sortOrder: number;
  urlKey?: string;
  defaultLanguage?: string;
  translations?: { [langCode: string]: CategoryTranslation };
}
