import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { BeesMultipartFile } from '../../proxy/bees-multipart-value.payload';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import { StorageType } from '../../storage/storage.type';
import { CategoryV3Service } from '../category-v3.service';
import { Category } from '../category';
import { CategoryImage } from '../models/category-image';

@Injectable({ providedIn: 'root' })
export class CategoryImageUploadService {
  constructor(
    private storageService: StorageService,
    private categoryService: CategoryV3Service,
  ) {}

  public async uploadCategoryGroup(
    fileName: string,
    base64: string,
    categories: Category[],
    storageType: StorageType,
    env: CountryEnvironmentModel,
  ): Promise<Category[]> {
    const multipartFile = new BeesMultipartFile('image/png', fileName, base64);

    const url = await this.storageService.upload(
      storageType,
      multipartFile,
      env,
    );
    if (!url) {
      return categories.concat([]);
    }

    const failedCategories: Category[] = [];
    const payload: { image: CategoryImage } = {
      image: {
        mainImageURL: url,
        iconImageURL: url,
        mobileImageURL: url,
      },
    };

    for (const category of categories) {
      const response = await this.categoryService.patchV3(
        category.id,
        payload,
        env,
      );

      if (!response.isSuccess) {
        console.log(response);
        failedCategories.push(category);
      }
    }

    console.log(
      `Uploaded file ${fileName} and updated categories:
      ${categories.map((i) => i.id).join(', ')}
      of which failed: ${failedCategories.map((i) => i.id).join(', ')}`,
    );

    return failedCategories;
  }
}
