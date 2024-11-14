import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { Item } from '../item';
import { BeesMultipartFile } from '../../proxy/bees-multipart-value.payload';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { ItemService } from '../item.service';
import { StorageType } from '../../storage/storage.type';

@Injectable({ providedIn: 'root' })
export class ItemImageUploadService {
  constructor(
    private storageService: StorageService,
    private itemService: ItemService,
  ) {}

  public async uploadItemGroup(
    fileName: string,
    base64: string,
    items: Item[],
    storageType: StorageType,
    env: CountryEnvironmentModel,
  ): Promise<boolean> {
    const multipartFile = new BeesMultipartFile('image/png', fileName, base64);

    const url = await this.storageService.upload(
      storageType,
      multipartFile,
      env,
    );
    if (!url) {
      return false;
    }

    for (const item of items) {
      item.image = url;
      if (item.translations) {
        for (const langCode in item.translations) {
          item.translations[langCode].image = url;
        }
      }
    }

    const itemUpdateResponse = await this.itemService.saveItems(items, env);

    if (!itemUpdateResponse.isSuccess) {
      console.log(itemUpdateResponse);
      return false;
    }

    console.log(
      `Uploaded file ${fileName} and updated items: ${items.map((i) => i.vendorItemId).join(', ')}`,
    );

    return true;
  }
}
