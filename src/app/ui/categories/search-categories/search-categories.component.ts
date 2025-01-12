import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { FormsModule } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
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

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.query.storeId = 'loading....';
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
    this.dialogService.open(
      ShowCategoryDetailsDialogComponent,
      '',
      new ShowCategoryDetailsDialogPayload(category, this.envOverride),
    );
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

  addGroup(val: string): void {
    if (!ObjectUtils.isNil(val) && !this.query.groups.includes(val)) {
      this.query.groups.push(val);
      this.reloadFilters();
    }
  }

  removeGroup(val: string): void {
    this.query.groups.splice(this.query.groups.indexOf(val), 1);
    this.reloadFilters();
  }
}

export const SEARCH_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: SearchCategoriesComponent,
  },
];
