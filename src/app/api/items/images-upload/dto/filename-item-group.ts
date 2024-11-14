import { Item } from '../../item';

export class FilenameItemGroup {
  constructor(
    public filename: string,
    public items: Item[],
  ) {}
}
