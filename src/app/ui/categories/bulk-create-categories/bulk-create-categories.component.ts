import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { firstValueFrom, Subscription } from 'rxjs';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { DialogService } from '../../../shared/dialog/dialog.service';
import {
  bulkCreateCategoriesCsvHeaders,
  exampleBulkCategoriesCreationCsv,
  exampleBulkCategoriesCreationJson,
} from './bulk-create-categories.example';
import { CategoryGroupType } from '../../../api/categories/category-group.type';
import { CategoryTranslation } from '../../../api/categories/models/category-translation';
import { CategoryV3Payload } from '../../../api/categories/category-v3.payload';
import { CategoryService } from '../../../api/categories/category.service';
import { Papa } from 'ngx-papaparse';
import { BulkCreateCategoriesCsvHeaders } from './bulk-create-categories-csv-headers';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { CountryEnvironmentLanguageModel } from '../../../api/env/country-environment-language.model';
import { CustomValidators } from '../../../shared/util/custom-validators';
import { FileUtils } from '../../../shared/util/file-utils';
import { CheckboxComponent } from '../../../shared/form-controls/checkbox/checkbox.component';
import { CategoryWithParent } from '../../../api/categories/category-with-parent';
import { Category } from '../../../api/categories/category';

interface BulkCreateCategoryCsvForm {
  csvFile: FormControl<Blob>;
  storeId: FormControl<string>;
  storeCategoryIdSuffix: FormControl<string | null>;
  updateExistingCategories: FormControl<boolean>;
}

interface BulkCreateCategoryJSONForm {
  json: FormControl<string>;
  storeId: FormControl<string>;
  storeCategoryIdSuffix: FormControl<string | null>;
  updateExistingCategories: FormControl<boolean>;
}

interface UserPayload {
  name: string;
  sortOrder?: number;
  groups?: CategoryGroupType[];
  translations?: { [langCode: string]: CategoryTranslation };
  restricted?: string[];
  storeCategoryId?: string;
  childCategories?: UserPayload[];
}

@Component({
  selector: 'app-bulk-create-categories',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    InputComponent,
    CheckboxComponent,
  ],
  templateUrl: './bulk-create-categories.component.html',
  styleUrl: './bulk-create-categories.component.scss',
})
export class BulkCreateCategoriesComponent implements OnInit, OnDestroy {
  private envSub!: Subscription;
  envOverride!: CountryEnvironmentModel;

  jsonForm!: FormGroup<BulkCreateCategoryJSONForm>;
  csvForm!: FormGroup<BulkCreateCategoryCsvForm>;
  private file: File | null = null;

  showJsonForm = false;

  constructor(
    private envOverrideService: EnvOverrideService,
    private dialogService: DialogService,
    private categoryService: CategoryService,
    private papa: Papa,
  ) {}

  ngOnInit(): void {
    this.jsonForm = new FormGroup<BulkCreateCategoryJSONForm>({
      storeId: new FormControl<string>('Loading...'!, {
        validators: Validators.required,
        nonNullable: true,
      }),
      json: new FormControl<string>(null!, {
        validators: Validators.required,
        nonNullable: true,
      }),
      storeCategoryIdSuffix: new FormControl<string | null>(null),
      updateExistingCategories: new FormControl<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    this.csvForm = new FormGroup<BulkCreateCategoryCsvForm>({
      storeId: new FormControl<string>('Loading...'!, {
        validators: Validators.required,
        nonNullable: true,
      }),
      csvFile: new FormControl(null!, {
        nonNullable: true,
        validators: CustomValidators.csvFileValidator,
      }),
      storeCategoryIdSuffix: new FormControl<string | null>(null),
      updateExistingCategories: new FormControl<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (value) {
        this.envOverride = value;
        this.jsonForm.controls.storeId.patchValue(value.storeId);
        this.csvForm.controls.storeId.patchValue(value.storeId);
      }
      // this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  showJsonExample(): void {
    this.dialogService.openShowCodeDialog(
      JSON.stringify(exampleBulkCategoriesCreationJson, null, 2),
      'Example template',
    );
  }

  downloadCsvExample(): void {
    FileUtils.downloadCsv(
      exampleBulkCategoriesCreationCsv,
      'BulkCreateCategoriesTemplate.csv',
    );
  }

  async onJsonFormSubmit(): Promise<void> {
    await this.saveCategories(
      JSON.parse(this.jsonForm.getRawValue().json),
      this.jsonForm.controls.storeId.value,
      this.jsonForm.controls.storeCategoryIdSuffix.value,
      this.jsonForm.controls.updateExistingCategories.value,
    );
  }

  onJsonToCsvConvert(): void {
    const csv = this.toCsvFromUserPayload(
      JSON.parse(this.jsonForm.getRawValue().json),
    );
    FileUtils.downloadCsv(csv, 'Categories.csv');
  }

  async onCsvFormSubmit(): Promise<void> {
    if (!this.file) {
      alert('You need to select file first!');
      return;
    }

    const content = await FileUtils.readFileAsString(this.file);
    const userPayload: UserPayload[] = this.toUserPayload(content);

    if (userPayload.length <= 0) {
      alert('Nothing to save!');
      return;
    }

    await firstValueFrom(
      this.dialogService.openShowCodeDialog(
        JSON.stringify(userPayload, null, 2),
        'Preview data',
      ),
    );

    const proceed = await firstValueFrom(
      this.dialogService.openConfirmDialog('Do you want to proceed?'),
    );

    if (proceed) {
      await this.saveCategories(
        userPayload,
        this.csvForm.getRawValue().storeId,
        this.csvForm.getRawValue().storeCategoryIdSuffix,
        this.csvForm.getRawValue().updateExistingCategories,
      );
    }
  }

  @ShowLoader()
  private async saveCategories(
    userPayload: UserPayload[],
    storeId: string,
    storeCategoryIdSuffix: string | null,
    updateExistingCategories: boolean,
  ): Promise<void> {
    interface NameIdPair {
      id: string;
      name: string;
    }
    const existingCategories: { id: string; payload: CategoryV3Payload }[] = [];

    console.log('Fetching all existing categories');
    const flatCategories: CategoryWithParent[] =
      await this.categoryService.getFlatCategories(this.envOverride);

    const l1 = this.toBeesPayload(
      userPayload,
      null,
      storeCategoryIdSuffix,
      flatCategories,
    );

    const l1Pairs: NameIdPair[] = [];

    if (l1.existingPayloads.length) {
      existingCategories.push(...l1.existingPayloads);
      l1Pairs.push(
        ...l1.existingPayloads.map((pl) => {
          return {
            id: pl.id,
            name: pl.payload.name,
          };
        }),
      );
    }

    if (l1.newPayloads.length) {
      const result = await this.categoryService.postV3(
        storeId,
        l1.newPayloads,
        this.envOverride,
      );

      if (!result.isSuccess) {
        alert('Error during creating of level 1 categories!');
        this.dialogService.openRequestResultDialog(result);
        return;
      }

      console.log('L1 categories created, ', result.response.response);
      l1Pairs.push(...result.response.response);
    }

    const failedCategoryRequests: string[] = [];
    for (const l1Pair of l1Pairs) {
      const rootCat: UserPayload = userPayload.find(
        (c) => c.name === l1Pair.name,
      )!;

      const l2 = this.toBeesPayload(
        rootCat.childCategories || [],
        l1Pair.id,
        storeCategoryIdSuffix,
        flatCategories,
      );

      const l2Pairs: NameIdPair[] = [];

      if (l2.existingPayloads.length) {
        existingCategories.push(...l2.existingPayloads);
        l2Pairs.push(
          ...l2.existingPayloads.map((pl) => {
            return {
              id: pl.id,
              name: pl.payload.name,
            };
          }),
        );
      }

      if (l2.newPayloads.length) {
        const l2Response = await this.categoryService.postV3(
          storeId,
          l2.newPayloads,
          this.envOverride,
        );

        if (!l2Response.isSuccess) {
          failedCategoryRequests.push(`${rootCat.name} -> children`);
          console.error(l2Response);
          continue;
        }

        console.log(
          `Created level 2 categories for parent '${l1Pair.name}': `,
          l2Response.response.response,
        );

        l2Pairs.push(...l2Response.response.response);
      }

      for (const l2Pair of l2Pairs) {
        const l2FullCategory = rootCat.childCategories!.find(
          (c) => c.name === l2Pair.name,
        )!;

        const l3 = this.toBeesPayload(
          l2FullCategory.childCategories || [],
          l2Pair.id,
          storeCategoryIdSuffix,
          flatCategories,
        );

        if (l3.existingPayloads) {
          existingCategories.push(...l3.existingPayloads);
        }

        if (l3.newPayloads.length) {
          const l3Response = await this.categoryService.postV3(
            storeId,
            l3.newPayloads,
            this.envOverride,
          );

          if (!l3Response.isSuccess) {
            failedCategoryRequests.push(
              `${rootCat.name} -> ${l2FullCategory.name} -> children`,
            );
            console.error(l3Response);
            continue;
          }

          console.log(
            `Created level 3 categories for '${rootCat.name}' -> '${l2FullCategory.name}': `,
            l3Response.response.response,
          );
        }
      }
    }

    if (existingCategories.length) {
      if (!updateExistingCategories) {
        this.showExistingSkippedCategories(
          existingCategories.map((ec) => ec.payload.storeCategoryId!),
        );
      } else {
        console.log(
          `Updating ${existingCategories.length} existing categories!`,
        );
        for (const exCat of existingCategories) {
          const updateResp = await this.categoryService.patchV3(
            exCat.id,
            exCat.payload,
            this.envOverride,
          );

          if (!updateResp.isSuccess) {
            failedCategoryRequests.push(
              `${exCat.payload.name} (${exCat.payload.storeCategoryId}) -> update`,
            );
            console.error(updateResp);
            continue;
          }

          console.log(
            `Updated category '${exCat.payload.name}' (${exCat.payload.storeCategoryId})`,
            updateResp.response.response,
          );
        }
      }
    }

    // Do not await this!
    this.showFailedCategories(failedCategoryRequests);
  }

  private async showFailedCategories(categories: string[]): Promise<void> {
    if (categories.length > 0) {
      this.dialogService.openShowCodeDialog(
        JSON.stringify(categories, null, 2),
        'Failed categories',
      );
    }
  }

  private async showExistingSkippedCategories(
    categories: string[],
  ): Promise<void> {
    if (categories.length > 0) {
      this.dialogService.openShowCodeDialog(
        JSON.stringify(categories, null, 2),
        `Not updated existing categories (${categories.length})`,
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  private toBeesPayload(
    userPayload: UserPayload[],
    parentId: string | null,
    storeCategoryIdSuffix: string | null,
    flatCategories: Category[],
  ): {
    newPayloads: CategoryV3Payload[];
    existingPayloads: { id: string; payload: CategoryV3Payload }[];
  } {
    const newCats: CategoryV3Payload[] = [];
    const existingCategories: { id: string; payload: CategoryV3Payload }[] = [];

    const suffixValue = storeCategoryIdSuffix
      ? `_${storeCategoryIdSuffix}`
      : '';

    for (const up of userPayload) {
      let translations: { [langCode: string]: CategoryTranslation } =
        up.translations || {};

      if (!translations) {
        translations = {};
      }

      if (!this.envOverride.singleLanguage) {
        const defaultLanguage: CountryEnvironmentLanguageModel =
          this.envOverride.defaultLanguage;

        const secondaryLanguage = this.envOverride.languages.find(
          (lang) => !lang.defaultLanguage,
        );

        if (!translations[defaultLanguage.languageCode]) {
          translations[defaultLanguage.languageCode] = {
            name: up.name,
          };
        }

        if (
          secondaryLanguage &&
          !translations[secondaryLanguage.languageCode]
        ) {
          translations[secondaryLanguage.languageCode] = {
            name: up.name,
          };
        }
      }

      const categoryPayload: CategoryV3Payload = {
        groups: ObjectUtils.isNil(parentId) ? up.groups : undefined,
        name: up.name,
        enabled: true,
        restricted: up.restricted,
        sortOrder: up.sortOrder || 0,
        storeCategoryId: ObjectUtils.isNil(up.storeCategoryId)
          ? undefined
          : `${up.storeCategoryId}${suffixValue}`,
        translations: translations,
        parentId: parentId || undefined,
      };

      if (categoryPayload.storeCategoryId) {
        const existingCat = flatCategories.find(
          (fc) => fc.storeCategoryId === categoryPayload.storeCategoryId,
        );
        if (existingCat) {
          existingCategories.push({
            id: existingCat.id,
            payload: categoryPayload,
          });
        } else {
          newCats.push(categoryPayload);
        }
      } else {
        newCats.push(categoryPayload);
      }
    }

    return {
      existingPayloads: existingCategories,
      newPayloads: newCats,
    };
  }

  private toUserPayload(csvData: string): UserPayload[] {
    const result: UserPayload[] = [];

    const papaResult = this.papa.parse(csvData, { header: true });

    if (papaResult.errors?.length) {
      this.dialogService.openShowCodeDialog(
        JSON.stringify(papaResult.errors, null, 2),
        'CSV has errors',
      );
    }

    // VALIDATE PARSED CSV FILE
    if (
      papaResult.data !== null &&
      papaResult.data !== undefined &&
      papaResult.data.length > 0 &&
      papaResult.errors.length === 0
    ) {
      const level1Rows = [];
      const level2Rows = [];
      const level3Rows = [];

      const rows = papaResult.data;

      // Prepare category levels and validate names
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const level1Name = row[BulkCreateCategoriesCsvHeaders.LEVEL_1]?.trim();
        const level2Name = row[BulkCreateCategoriesCsvHeaders.LEVEL_2]?.trim();
        const level3Name = row[BulkCreateCategoriesCsvHeaders.LEVEL_3]?.trim();

        if (!level1Name) {
          this.failWith(
            `You cannot create category with no name on row ${row}!`,
          );
        }

        if (level3Name && !level2Name) {
          this.failWith(
            `You cannot create level 3 category with no level2 name on row ${row}!`,
          );
        }

        if (!level3Name && !level2Name) {
          level1Rows.push(row);
        }

        if (!level3Name && level2Name) {
          level2Rows.push(row);
        }

        if (level3Name && level2Name) {
          level3Rows.push(row);
        }
      }

      const level1Categories: Map<string, UserPayload> = new Map<
        string,
        UserPayload
      >();

      for (const level1Row of level1Rows) {
        const name = level1Row[BulkCreateCategoriesCsvHeaders.LEVEL_1]?.trim();
        level1Categories.set(name, this.constructUserPayload(name, level1Row));
      }

      for (const level2Row of level2Rows) {
        const parentName =
          level2Row[BulkCreateCategoriesCsvHeaders.LEVEL_1]?.trim();
        const name = level2Row[BulkCreateCategoriesCsvHeaders.LEVEL_2]?.trim();

        if (!level1Categories.has(parentName)) {
          this.failWith(
            `Cannot create level 2 category ${name} because there is no parent category ${parentName}`,
          );
        }

        level1Categories
          .get(parentName)
          ?.childCategories?.push(this.constructUserPayload(name, level2Row));
      }

      for (const level3Row of level3Rows) {
        const parentName =
          level3Row[BulkCreateCategoriesCsvHeaders.LEVEL_1]?.trim();
        const l2Name =
          level3Row[BulkCreateCategoriesCsvHeaders.LEVEL_2]?.trim();
        const name = level3Row[BulkCreateCategoriesCsvHeaders.LEVEL_3]?.trim();

        if (!level1Categories.has(parentName)) {
          this.failWith(
            `Cannot create level 3 category ${name} because there is no parent category ${parentName}`,
          );
        }

        const rootCategory = level1Categories.get(parentName)!;
        const l2Category = rootCategory.childCategories?.find(
          (ct) => ct.name === l2Name,
        );

        if (!l2Category) {
          this.failWith(
            `Cannot create level 3 category ${name} because there is no level 2 category ${l2Category}`,
          );
        }

        l2Category?.childCategories?.push(
          this.constructUserPayload(name, level3Row),
        );
      }

      result.push(...level1Categories.values());
    }

    return result;
  }

  // For testing purpose
  private toCsvFromUserPayload(userPayload: UserPayload[]): string {
    const toCsvRow = (
      l1Name: string,
      l2Name: string | null,
      l3Name: string | null,
      payload: UserPayload,
    ): string => {
      const isL1 = ObjectUtils.isNil(l2Name);
      let row = `${l1Name}`;
      row += `,${l2Name || ''}`;
      row += `,${l3Name || ''}`;
      row += `,${payload.sortOrder || 0}`;
      row += `,${isL1 ? payload.groups?.join(',') || '' : ''}`;
      row += `,${payload.restricted?.join(',') || ''}`;
      row += `,${payload.storeCategoryId || ''}`;
      row += ',';

      if (!this.envOverride.singleLanguage && payload.translations) {
        const otherLang = this.envOverride.languages.find(
          (l) => !l.defaultLanguage,
        )!;
        if (payload.translations[otherLang.languageCode]) {
          row += `${payload.translations[otherLang.languageCode].name}`;
        }
      }

      return row;
    };

    let csv = bulkCreateCategoriesCsvHeaders;
    for (const root of userPayload) {
      csv += `\n${toCsvRow(root.name, null, null, root)}`;

      if (root.childCategories?.length) {
        for (const l2 of root.childCategories) {
          csv += `\n${toCsvRow(root.name, l2.name, null, l2)}`;

          if (l2.childCategories?.length) {
            for (const l3 of l2.childCategories) {
              csv += `\n${toCsvRow(root.name, l2.name, l3.name, l3)}`;
            }
          }
        }
      }
    }

    return csv;
  }

  private failWith(msg: string): void {
    alert(msg);
    throw new Error(msg);
  }

  private constructUserPayload(name: string, csvRow: any): UserPayload {
    const userPayload: UserPayload = {
      name: name,
      storeCategoryId:
        csvRow[BulkCreateCategoriesCsvHeaders.STORE_CATEGORY]?.trim() || null,
      sortOrder:
        Number(csvRow[BulkCreateCategoriesCsvHeaders.SORT_ORDER]?.trim()) || 0,
      childCategories: [],
    };

    const groups = csvRow[BulkCreateCategoriesCsvHeaders.GROUPS]?.trim();
    if (groups) {
      const validGroups = groups
        .split(/,\s*/)
        .map((gr: string | number) => {
          // @ts-ignore
          return CategoryGroupType[gr];
        })
        .filter((gr: unknown) => !ObjectUtils.isNil(gr));

      userPayload.groups = validGroups;
    }

    const restrictions =
      csvRow[BulkCreateCategoriesCsvHeaders.RESTRICTED]?.trim();
    if (restrictions) {
      userPayload.restricted = restrictions.split(/,\s*/);
    }

    const translation =
      csvRow[BulkCreateCategoriesCsvHeaders.NAME_TRANSLATION]?.trim() || name;
    if (!this.envOverride.singleLanguage) {
      const defaultLanguage: CountryEnvironmentLanguageModel =
        this.envOverride.defaultLanguage;

      const secondaryLanguage = this.envOverride.languages.find(
        (lang) => !lang.defaultLanguage,
      );

      userPayload.translations = {
        [defaultLanguage.languageCode]: {
          name: name,
        },
        [secondaryLanguage!.languageCode]: {
          name: translation,
        },
      };
    }

    return userPayload;
  }
}

export const BULK_CREATE_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: BulkCreateCategoriesComponent,
  },
];
