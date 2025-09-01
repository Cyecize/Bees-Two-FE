import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CategoryV3Service } from '../../../api/categories/category-v3.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { CategoryAssignMatchType } from '../../../api/categories/item-assign/category-assign-match-type';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ItemService } from '../../../api/items/item.service';
import { NgIf } from '@angular/common';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import { CustomValidators } from '../../../shared/util/custom-validators';
import {
  bulkAssignItemsExampleCsv,
  bulkAssignItemsExampleJson,
} from './bulk-assign-items-example';
import { FileUtils } from '../../../shared/util/file-utils';
import {
  CategoryItemPair,
  CategoryItemPairImpl,
} from '../../../api/categories/item-assign/dto/category-item-pair';
import { Papa } from 'ngx-papaparse';
import { BulkAssignItemsCsvHeaders } from './bulk-assign-items-csv-headers';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { ArrayUtils } from '../../../shared/util/array-utils';
import {
  ItemSearchQueryImpl,
  ItemsSearchQuery,
} from '../../../api/items/items-search.query';
import { CategoryAssignMatchService } from '../../../api/categories/item-assign/category-assign-match.service';
import { CategoryWithParent } from '../../../api/categories/category-with-parent';
import { CategoryV3QueryImpl } from '../../../api/categories/category-v3.query';
import { CategoryV3 } from '../../../api/categories/category-v3';
import { CategoryItemGroup } from '../../../api/categories/item-assign/dto/category-item-group';
import { CategoryConstants } from '../../../api/categories/category-constants';

interface BulkItemAssignForm {
  vendorId: FormControl<string>;
  matchType: FormControl<CategoryAssignMatchType>;
}

interface CsvForm {
  csvFile: FormControl<Blob>;
}

interface JsonForm {
  json: FormControl<string>;
}

@Component({
  selector: 'app-bulk-assign-items',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    NgIf,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './bulk-assign-items.component.html',
  styleUrl: './bulk-assign-items.component.scss',
})
export class BulkAssignItemsComponent implements OnInit, OnDestroy {
  private envSub!: Subscription;
  envOverride!: CountryEnvironmentModel;

  private file: File | null = null;

  nameTreeDelimiter = CategoryConstants.CATEGORY_NAME_TREE_DELIMITER;
  matchTypes = CategoryAssignMatchType;
  matchTypeOptions: SelectOption[] = [];
  form!: FormGroup<BulkItemAssignForm>;
  jsonForm = new FormGroup<JsonForm>({
    json: new FormControl(null!, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  csvForm = new FormGroup<CsvForm>({
    csvFile: new FormControl(null!, {
      validators: [Validators.required, CustomValidators.csvFileValidator],
      nonNullable: true,
    }),
  });

  showJsonForm = false;

  constructor(
    private dialogService: DialogService,
    private categoryService: CategoryV3Service,
    private envOverrideService: EnvOverrideService,
    private itemService: ItemService,
    private papa: Papa,
    private categoryAssignMatchService: CategoryAssignMatchService,
  ) {}

  ngOnInit(): void {
    this.matchTypeOptions = Object.keys(CategoryAssignMatchType).map(
      (op) => new SelectOptionKey(op),
    );

    this.form = new FormGroup<BulkItemAssignForm>({
      vendorId: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      matchType: new FormControl<CategoryAssignMatchType>(
        CategoryAssignMatchType.STORE_CATEGORY_ID,
        {
          validators: [Validators.required],
          nonNullable: true,
        },
      ),
    });

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (value) {
        this.envOverride = value;
        this.form.controls.vendorId.patchValue(value.vendorId);
      }
      // this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  get currentMatchType(): CategoryAssignMatchType {
    return this.form.controls.matchType.value;
  }

  showJsonExample(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(bulkAssignItemsExampleJson, null, 2),
      'Example template',
    );
  }

  downloadCsvExample(): void {
    FileUtils.downloadCsv(bulkAssignItemsExampleCsv, 'BulkAssignTemplate.csv');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  async onFormSubmit(): Promise<void> {
    let payload: CategoryItemPair[];
    if (this.showJsonForm) {
      payload = JSON.parse(this.jsonForm.getRawValue().json);
    } else {
      if (!this.file) {
        alert('You need to select file first!');
        return;
      }

      const content = await FileUtils.readFileAsString(this.file);
      payload = this.toCategoryPairs(content);
    }

    const filteredPairs = await this.filterExistingItems(payload);

    if (filteredPairs.missingVendorItemIds.length > 0) {
      const conf = await firstValueFrom(
        this.dialogService.openConfirmDialog(
          `The following vendor item ids are missing: ${filteredPairs.missingVendorItemIds.join(', ')}`,
          'Warning',
          'Proceed Anyway',
        ),
      );

      if (!conf) {
        return;
      }
    }

    const pairs = filteredPairs.validPairs;
    const flatCategories: CategoryWithParent[] = await this.getFlatCategories();

    const matchResult = this.categoryAssignMatchService.match(
      pairs,
      flatCategories,
      this.form.getRawValue().matchType,
    );

    if (matchResult.nonMatchingPairs.length > 0) {
      console.log('Non matching paris: ', matchResult.nonMatchingPairs);
      const conf = await firstValueFrom(
        this.dialogService.openConfirmDialog(
          `There are ${matchResult.nonMatchingPairs.length} item - category pairs that don't match (check the logs)`,
          'Warning',
          'Proceed Anyway',
        ),
      );

      if (!conf) {
        return;
      }
    }

    const hasErrors = await this.doPatchCategories(
      matchResult.categoryItemGroups,
    );

    let msg = 'Operation succeeded';
    if (hasErrors) {
      msg = 'Operation finished with some errors, check the console!';
    }

    this.dialogService.openConfirmDialog(msg, 'Info', 'OK');
  }

  isFormInvalid(): boolean {
    if (!this.form.valid) {
      return true;
    }

    if (this.showJsonForm) {
      return !this.jsonForm.valid;
    }

    return !this.csvForm.valid;
  }

  @ShowLoader()
  private async doPatchCategories(
    groups: CategoryItemGroup[],
  ): Promise<boolean> {
    console.log(`Will update ${groups.length} categories!`);

    let hasErrors = false;
    for (const categoryItemGroup of groups) {
      console.log(
        `Updating category ${categoryItemGroup.category.name} with items: ${categoryItemGroup.items.map((it) => it.vendorItemId).join(', ')}`,
      );

      const resp = await this.categoryService.assignItems(
        categoryItemGroup.category.id,
        categoryItemGroup.items,
        this.form.getRawValue().vendorId,
        this.envOverride,
      );

      if (!resp.isSuccess) {
        hasErrors = true;
        console.log(resp);
      }
    }

    return hasErrors;
  }

  private toCategoryPairs(csvContent: string): CategoryItemPair[] {
    const papaResult = this.papa.parse(csvContent, { header: true });

    if (papaResult.errors?.length) {
      this.dialogService.openShowCodeDialog(
        JSON.stringify(papaResult.errors, null, 2),
        'CSV has errors',
      );
    }

    if (
      papaResult.data !== null &&
      papaResult.data !== undefined &&
      papaResult.data.length > 0 &&
      papaResult.errors.length === 0
    ) {
      const pairs: CategoryItemPair[] = [];

      for (let i = 0; i < papaResult.data.length; i++) {
        const row = papaResult.data[i];
        const category = row[BulkAssignItemsCsvHeaders.CATEGORY]?.trim();
        const vendorItemId =
          row[BulkAssignItemsCsvHeaders.VENDOR_ITEM_ID]?.trim();
        const sortOrder =
          Number(row[BulkAssignItemsCsvHeaders.SORT_ORDER]?.trim()) || 0;

        if (!category) {
          this.failWith(`Missing category data on row ${i}`);
        }

        if (!vendorItemId) {
          this.failWith(`Missing vendor item id on row ${i}`);
        }

        pairs.push(new CategoryItemPairImpl(category, vendorItemId, sortOrder));
      }

      return pairs;
    }

    return [];
  }

  private failWith(msg: string): void {
    alert(msg);
    throw new Error(msg);
  }

  @ShowLoader()
  private async filterExistingItems(
    pairs: CategoryItemPair[],
  ): Promise<ItemsFilterResult> {
    const uniqueVendorItemIds = [...new Set(pairs.map((p) => p.vendorItemId))];
    const existingItems: string[] = [];
    for (const vendorItemIds of ArrayUtils.splitToBatches(
      uniqueVendorItemIds,
      100,
    )) {
      const query: ItemsSearchQuery = new ItemSearchQueryImpl();
      query.page.pageSize = 150;
      query.vendorItemIds = vendorItemIds;
      query.vendorId = this.envOverride.vendorId;

      const response = await this.itemService.searchItems(
        query,
        this.envOverride,
      );

      if (!response.isSuccess) {
        console.log(response);
        this.failWith('Could not fetch items, check the console!');
      }

      existingItems.push(
        ...response.response.response.items.map((i) => i.vendorItemId),
      );
    }

    const missingVendorItemIds = new Set<string>();
    const validPairs: CategoryItemPair[] = [];

    for (const pair of pairs) {
      if (!existingItems.includes(pair.vendorItemId)) {
        missingVendorItemIds.add(pair.vendorItemId);
      } else {
        validPairs.push(pair);
      }
    }

    return {
      missingVendorItemIds: [...missingVendorItemIds],
      validPairs: validPairs,
    };
  }

  @ShowLoader()
  private async getFlatCategories(): Promise<CategoryWithParent[]> {
    try {
      return await this.categoryService.getFlatCategories(this.envOverride);
    } catch (err) {
      return this.failWith(
        'Error while fetching categories (check the console), aborting execution!',
      )!;
    }
  }
}

interface ItemsFilterResult {
  validPairs: CategoryItemPair[];
  missingVendorItemIds: string[];
}

export const BULK_ASSIGN_ITEM_ROUTES: Routes = [
  {
    path: '',
    component: BulkAssignItemsComponent,
  },
];
