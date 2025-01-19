import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { FormsModule } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { WrappedResponse } from '../../../shared/util/field-error-wrapper';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { CategoryV3 } from '../../../api/categories/category-v3';
import {
  CategoryV3Query,
  CategoryV3QueryImpl,
} from '../../../api/categories/category-v3.query';
import { CategoryService } from '../../../api/categories/category.service';
import { ShowCategoryDetailsDialogComponent } from '../show-category-details-dialog/show-category-details-dialog.component';
import { ShowCategoryDetailsDialogPayload } from '../show-category-details-dialog/show-category-details-dialog.payload';
import { CategoryGroupType } from '../../../api/categories/category-group.type';
import {
  SelectOptionKey,
  SelectOptionKvp,
} from '../../../shared/form-controls/select/select.option';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import {
  JszipService,
  NameAndUrlPair,
  NameAndUrlPairImpl,
} from '../../../shared/util/jszip.service';
import {
  CategoryItemPair,
  CategoryItemPairImpl,
} from '../../../api/categories/item-assign/dto/category-item-pair';
import { CategoryConstants } from '../../../api/categories/category-constants';

@Component({
  selector: 'app-search-categories',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
    FormsModule,
    CheckboxComponent,
    SelectComponent,
  ],
  templateUrl: './search-categories.component.html',
  styleUrl: './search-categories.component.scss',
})
export class SearchCategoriesComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  query: CategoryV3Query = new CategoryV3QueryImpl();

  categories: CategoryV3[] = [];
  fullResponse!: WrappedResponse<CategoryV3[]>;

  groups: SelectOptionKey[] = [];

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private categoryService: CategoryService,
    private jsZipService: JszipService,
  ) {}

  ngOnInit(): void {
    this.query.storeId = 'loading....';

    this.groups = [new SelectOptionKvp('Choose one', null, false)].concat(
      ...Object.keys(CategoryGroupType).map((val) => new SelectOptionKey(val)),
    );

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (!ObjectUtils.isNil(value)) {
        this.envOverride = value;
        if (this.query.storeId) {
          this.query.storeId = value?.storeId;
        }

        this.reloadFilters();
      }
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async reloadFilters(): Promise<void> {
    // This is the place to perform some pre-fetch tasks like resetting pagination

    this.groups = [new SelectOptionKvp('Choose one', null, false)].concat(
      ...Object.keys(CategoryGroupType)
        .filter((val) => !this.query.groups.includes(val as CategoryGroupType))
        .map((val) => new SelectOptionKey(val)),
    );

    await this.fetchData();
  }

  private async fetchData(): Promise<boolean> {
    const response = await this.categoryService.searchCategoriesV3(
      this.query,
      this.envOverride,
    );

    this.fullResponse = response;

    if (response.isSuccess) {
      const beesResponse = response.response;
      if (beesResponse.response) {
        this.categories = beesResponse.response;
      } else {
        this.categories = [];
      }

      return true;
    }

    return false;
  }

  openResponseDetailsDialog(): void {
    this.dialogService.openRequestResultDialog(this.fullResponse);
  }

  openDetailsDialog(category: CategoryV3): void {
    this.dialogService
      .open(
        ShowCategoryDetailsDialogComponent,
        '',
        new ShowCategoryDetailsDialogPayload(category, this.envOverride),
      )
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          this.reloadFilters();
        }
      });
  }

  addId(id: string): void {
    if (!ObjectUtils.isNil(id) && !this.query.ids.includes(id)) {
      this.query.ids.push(id);
      this.reloadFilters();
    }
  }

  removeId(id: string): void {
    this.query.ids.splice(this.query.ids.indexOf(id), 1);
    this.reloadFilters();
  }

  addRestricted(val: string): void {
    if (!ObjectUtils.isNil(val) && !this.query.restricted.includes(val)) {
      this.query.restricted.push(val);
      this.reloadFilters();
    }
  }

  removeRestricted(val: string): void {
    this.query.restricted.splice(this.query.restricted.indexOf(val), 1);
    this.reloadFilters();
  }

  addVendorId(val: string): void {
    if (!ObjectUtils.isNil(val) && !this.query.vendorIds.includes(val)) {
      this.query.vendorIds.push(val);
      this.reloadFilters();
    }
  }

  removeVendorId(val: string): void {
    this.query.vendorIds.splice(this.query.vendorIds.indexOf(val), 1);
    this.reloadFilters();
  }

  addGroup(val: CategoryGroupType): void {
    if (!val) {
      this.query.groups = [];
      this.reloadFilters();
      return;
    }

    if (!ObjectUtils.isNil(val) && !this.query.groups.includes(val)) {
      this.query.groups.push(val);
      this.reloadFilters();
    }
  }

  removeGroup(val: CategoryGroupType): void {
    this.query.groups.splice(this.query.groups.indexOf(val), 1);
    this.reloadFilters();
  }

  async onDeleteAll(): Promise<void> {
    const confirmed = await firstValueFrom(
      this.dialogService.openConfirmDialog(
        `This will remove all categories for ${this.envOverride?.envName}, are you sure?`,
      ),
    );

    if (!confirmed) {
      return;
    }

    const allIds = this.categories.map((c) => c.id);
    await this.doDelete(allIds);
  }

  @ShowLoader()
  async onDownloadAllImages(): Promise<void> {
    const files: NameAndUrlPair[] = [];
    this.convertCategoryToFile(this.categories, files);

    const blob = await this.jsZipService.downloadAndCompress(files);

    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'images.zip';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  private convertCategoryToFile(
    categories: CategoryV3[],
    files: NameAndUrlPair[],
  ): void {
    for (const category of categories) {
      if (category.image) {
        files.push(
          new NameAndUrlPairImpl(
            category.image.mainImageURL,
            category.storeCategoryId || category.name,
          ),
        );
      }

      if (category.categories?.length) {
        this.convertCategoryToFile(category.categories, files);
      }
    }
  }

  @ShowLoader()
  private async doDelete(ids: string[]): Promise<void> {
    const response = await this.categoryService.deleteV3(ids);
    this.dialogService.openRequestResultDialog(response).subscribe((value) => {
      this.reloadFilters();
    });
  }

  extractAllItems(): void {
    const vendorItemIds = new Set<string>();

    const extract = (cats: CategoryV3[]): void => {
      for (const cat of cats) {
        if (cat.items?.length) {
          cat.items.forEach((i) => vendorItemIds.add(i.vendorItemId));
        }

        if (cat.categories?.length) {
          extract(cat.categories);
        }
      }
    };

    extract(this.categories);

    this.dialogService.openShowCodeDialog(
      JSON.stringify([...vendorItemIds], null, 2),
      `Vendor Item IDs (${vendorItemIds.size})`,
    );
  }

  extractAssignedItems(): void {
    const pairs: CategoryItemPair[] = [];

    const extract = (cats: CategoryV3[], treeName: string): void => {
      for (const cat of cats) {
        if (cat.items?.length) {
          for (const item of cat.items) {
            pairs.push(
              new CategoryItemPairImpl(
                `${treeName}${cat.name}`,
                item.vendorItemId,
                item.sortOrder,
              ),
            );
          }
        }

        if (cat.categories?.length) {
          extract(
            cat.categories,
            `${cat.name}${CategoryConstants.CATEGORY_NAME_TREE_DELIMITER}`,
          );
        }
      }
    };

    extract(this.categories, '');

    this.dialogService.openShowCodeDialog(
      JSON.stringify(pairs, null, 2),
      'Bulk Assign Payload',
    );
  }
}

export const SEARCH_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: SearchCategoriesComponent,
  },
];
