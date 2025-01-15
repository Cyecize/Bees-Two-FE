import { Category } from './category';

export interface CategoryWithParent extends Category {
  parent: CategoryWithParent | null;
}
