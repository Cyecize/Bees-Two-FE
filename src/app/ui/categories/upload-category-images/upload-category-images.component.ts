import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { JszipService } from '../../../shared/util/jszip.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { NgIf } from '@angular/common';
import { StorageType } from '../../../api/storage/storage.type';
import { CategoryFilenameMatchType } from '../../../api/categories/images-upload/category-filename-match-type';
import { CategoryFilenameMatchStrategy } from '../../../api/categories/images-upload/category-filename-match-strategy';
import { CategoryV3Service } from '../../../api/categories/category-v3.service';
import { CategoryFilenameMatchService } from '../../../api/categories/images-upload/category-filename-match.service';
import { CategoryImageUploadService } from '../../../api/categories/images-upload/category-image-upload.service';
import { CategoryV3 } from '../../../api/categories/category-v3';
import {
  CategoryV3Query,
  CategoryV3QueryImpl,
} from '../../../api/categories/category-v3.query';
import { CategoryFilenameMatchResults } from '../../../api/categories/images-upload/dto/category-filename-match-results';
import { Category } from '../../../api/categories/category';
import { InputComponent } from '../../../shared/form-controls/input/input.component';

interface UploadCategoryImagesForm {
  zipFile: FormControl<Blob>;
  matchType: FormControl<CategoryFilenameMatchType>;
  matchStrategy: FormControl<CategoryFilenameMatchStrategy>;
  fileNameSuffix: FormControl<string | null>;
  storageType: FormControl<StorageType>;
}

@Component({
  selector: 'app-upload-category-images',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    EnvOverrideFieldComponent,
    NgIf,
    InputComponent,
  ],
  templateUrl: './upload-category-images.component.html',
  styleUrl: './upload-category-images.component.scss',
})
export class UploadCategoryImagesComponent implements OnInit, OnDestroy {
  private file: File | null = null;
  private envSub!: Subscription;
  envOverride!: CountryEnvironmentModel;
  form!: FormGroup<UploadCategoryImagesForm>;

  matchTypeOptions: SelectOption[] = [];
  matchStrategyOptions: SelectOption[] = [];
  storageTypes: SelectOption[] = [];

  constructor(
    private zipService: JszipService,
    private envOverrideService: EnvOverrideService,
    private categoryService: CategoryV3Service,
    private categoryFilenameMatchService: CategoryFilenameMatchService,
    private dialogService: DialogService,
    private categoryImageUploadService: CategoryImageUploadService,
  ) {}

  ngOnInit(): void {
    this.matchTypeOptions = Object.keys(CategoryFilenameMatchType).map(
      (op) => new SelectOptionKey(op),
    );

    this.matchStrategyOptions = Object.keys(CategoryFilenameMatchStrategy).map(
      (op) => new SelectOptionKey(op),
    );

    this.storageTypes = Object.keys(StorageType).map(
      (op) => new SelectOptionKey(op),
    );

    this.form = new FormGroup<UploadCategoryImagesForm>({
      zipFile: new FormControl(null!, {
        nonNullable: true,
        validators: this.zipFileValidator,
      }),
      matchStrategy: new FormControl<CategoryFilenameMatchStrategy>(
        CategoryFilenameMatchStrategy.EXACT_MATCH,
        { nonNullable: true, validators: [Validators.required] },
      ),
      matchType: new FormControl<CategoryFilenameMatchType>(
        CategoryFilenameMatchType.NAME,
        { nonNullable: true, validators: [Validators.required] },
      ),
      storageType: new FormControl<StorageType>(StorageType.BEES_STORAGE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fileNameSuffix: new FormControl<string | null>(null),
    });

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (value) {
        this.envOverride = value;
      }
      // this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  get currentMatchType(): string {
    return this.form.getRawValue().matchType;
  }

  //TODO: validate content of the zip file to ignore files that are not images
  async processZipFile(): Promise<void> {
    if (!this.file) {
      console.error('No file selected!');
      return;
    }

    const suffix = this.form.getRawValue().fileNameSuffix || '';
    const fileNames = await this.zipService.getFileNames(this.file);

    const categories: CategoryV3[] = await this.fetchCategories();
    if (!categories.length) {
      alert('No categories found!');
      return;
    }

    const fileGroups = this.categoryFilenameMatchService.match(
      fileNames,
      this.form.getRawValue().matchType,
      this.form.getRawValue().matchStrategy,
      categories,
      suffix,
    );

    if (fileGroups.nonMatchingFileNames.length) {
      console.log(
        'File names with no categories: ',
        fileGroups.nonMatchingFileNames,
      );
    } else {
      console.log('Mapping of file names -> categories', fileGroups);
    }

    const message = `Found matching categories for ${fileGroups.filenameGroups.length} files!
    ${fileGroups.nonMatchingFileNames.length} files don't have matching category (listed in the console).
    Do you want to continue?`;

    this.dialogService.openConfirmDialog(message).subscribe((conf) => {
      if (!conf) {
        return;
      }

      this.uploadAndUpdate(fileGroups);
    });
  }

  @ShowLoader()
  private async fetchCategories(): Promise<CategoryV3[]> {
    const query: CategoryV3Query = new CategoryV3QueryImpl();
    query.storeId = this.envOverride.storeId;

    const response = await this.categoryService.searchCategoriesV3(
      query,
      this.envOverride,
    );

    if (!response.isSuccess) {
      alert('Could not fetch categories!');
      this.dialogService.openRequestResultDialog(response);
      return [];
    }

    const flatCategories: CategoryV3[] = [];

    const extractCategories = (category: CategoryV3): void => {
      if (category.categories?.length) {
        flatCategories.push(...category.categories);
        category.categories.forEach((c) => extractCategories(c));
      }
    };

    response.response.response.forEach((c) => {
      flatCategories.push(c);
      extractCategories(c);
    });

    return flatCategories;
  }

  @ShowLoader()
  private async uploadAndUpdate(
    fileGroups: CategoryFilenameMatchResults,
  ): Promise<void> {
    const failedFileNames: string[] = [];
    const succeededFileNames: string[] = [];
    const failedCategories: Category[] = [];
    let processedFilesCount = 0;

    await this.zipService.iterate(this.file!, async (name, file) => {
      const fileGroup = fileGroups.filenameGroups.find(
        (fng) => fng.filename === name,
      );

      // Skip files that don't have categories for them.
      if (!fileGroup) {
        return;
      }

      const content = await file.async('base64');

      const failedCatsPerGroup: Category[] =
        await this.categoryImageUploadService.uploadCategoryGroup(
          file.name,
          content,
          fileGroup.categories,
          this.form.getRawValue().storageType,
          this.envOverride,
        );

      failedCategories.push(...failedCatsPerGroup);

      processedFilesCount++;
      if (failedCatsPerGroup.length) {
        failedFileNames.push(name);
      } else {
        succeededFileNames.push(name);
      }
    });

    if (processedFilesCount !== fileGroups.filenameGroups.length) {
      alert('Did not process all files (This should never happen!)');
    } else {
      this.dialogService.openConfirmDialog(
        `${succeededFileNames.length} files were uploaded!`,
        'Operation completed',
        'OK',
      );
    }

    if (failedFileNames.length > 0) {
      alert('Some files failed to upload, check the console.');
      console.log('Failed file uploads: ', failedFileNames);
      console.log('Succeeded file uploads: ', succeededFileNames);
    }

    if (failedCategories.length > 0) {
      alert(
        'Some categories failed to update to the new image, check the console.',
      );
      console.log('Failed category updates: ', failedCategories);
    }
  }

  private zipFileValidator(control: any): any {
    const fileName = control.value;
    if (fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      if (extension !== 'zip') {
        return { invalidFileType: true };
      }
    } else {
      return { fileRequired: true };
    }
    return null;
  }
}

export const UPLOAD_CATEGORY_IMAGES_ROUTES: Routes = [
  {
    path: '',
    component: UploadCategoryImagesComponent,
  },
];
