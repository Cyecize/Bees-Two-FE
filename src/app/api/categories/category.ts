import { CategoryImage } from './models/category-image';

export interface Category {
  id: string;
  storeCategoryId?: string;
  name: string;
  categoryLevel: number;
  enabled: boolean;
  image: CategoryImage;
}
