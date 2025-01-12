import { Category } from '../../category';

export class FilenameCategoryGroup {
  constructor(
    public filename: string,
    public categories: Category[],
  ) {}
}
