import { Category } from './category';

/**
 * @monaco
 */
export interface CategoryWithParent extends Category {
  parent: CategoryWithParent | null;
}
