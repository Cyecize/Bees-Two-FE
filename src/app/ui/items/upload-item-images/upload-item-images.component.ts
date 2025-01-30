import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { JszipService } from '../../../shared/util/jszip.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ItemFilenameMatchType } from '../../../api/items/images-upload/item-filename-match-type';
import { ItemFilenameMatchStrategy } from '../../../api/items/images-upload/item-filename-match-strategy';
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
import { Item } from '../../../api/items/item';
import { ItemService } from '../../../api/items/item.service';
import {
  ItemSearchQueryImpl,
  ItemsSearchQuery,
} from '../../../api/items/items-search.query';
import { ItemFilenameMatchService } from '../../../api/items/images-upload/item-filename-match.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { NgIf } from '@angular/common';
import { ItemFilenameMatchResults } from '../../../api/items/images-upload/dto/item-filename-match-results';
import { ItemImageUploadService } from '../../../api/items/images-upload/item-image-upload.service';
import { StorageType } from '../../../api/storage/storage.type';
import { FilenameUtil } from '../../../shared/util/filename.util';
import { CustomValidators } from '../../../shared/util/custom-validators';
import { ArrayUtils } from '../../../shared/util/array-utils';

interface UploadItemImagesForm {
  zipFile: FormControl<Blob>;
  matchType: FormControl<ItemFilenameMatchType>;
  matchStrategy: FormControl<ItemFilenameMatchStrategy>;
  storageType: FormControl<StorageType>;
}

@Component({
  selector: 'app-upload-item-images',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    EnvOverrideFieldComponent,
    NgIf,
  ],
  templateUrl: './upload-item-images.component.html',
  styleUrl: './upload-item-images.component.scss',
})
export class UploadItemImagesComponent implements OnInit, OnDestroy {
  private file: File | null = null;
  private envSub!: Subscription;
  envOverride!: CountryEnvironmentModel;
  form!: FormGroup<UploadItemImagesForm>;

  matchTypeOptions: SelectOption[] = [];
  matchStrategyOptions: SelectOption[] = [];
  storageTypes: SelectOption[] = [];

  constructor(
    private zipService: JszipService,
    private envOverrideService: EnvOverrideService,
    private itemService: ItemService,
    private itemFilenameMatchService: ItemFilenameMatchService,
    private dialogService: DialogService,
    private itemImageUploadService: ItemImageUploadService,
  ) {}

  ngOnInit(): void {
    this.matchTypeOptions = Object.keys(ItemFilenameMatchType).map(
      (op) => new SelectOptionKey(op),
    );

    this.matchStrategyOptions = Object.keys(ItemFilenameMatchStrategy).map(
      (op) => new SelectOptionKey(op),
    );

    this.storageTypes = Object.keys(StorageType).map(
      (op) => new SelectOptionKey(op),
    );

    this.form = new FormGroup<UploadItemImagesForm>({
      zipFile: new FormControl(null!, {
        nonNullable: true,
        validators: CustomValidators.zipFileValidator,
      }),
      matchStrategy: new FormControl<ItemFilenameMatchStrategy>(
        ItemFilenameMatchStrategy.EXACT_MATCH,
        { nonNullable: true, validators: [Validators.required] },
      ),
      matchType: new FormControl<ItemFilenameMatchType>(
        ItemFilenameMatchType.SKU,
        { nonNullable: true, validators: [Validators.required] },
      ),
      storageType: new FormControl<StorageType>(StorageType.BEES_STORAGE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
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

  //TODO: validate content of the zip file to ignore files that are not images
  async processZipFile(): Promise<void> {
    if (!this.file) {
      console.error('No file selected!');
      return;
    }

    const fileNames = await this.zipService.getFileNames(this.file);

    const items = await this.fetchItems(fileNames);
    if (!items.length) {
      alert('No items found for this zip file!');
      return;
    }

    const fileGroups = this.itemFilenameMatchService.match(
      fileNames,
      this.form.getRawValue().matchType,
      this.form.getRawValue().matchStrategy,
      items,
    );

    if (fileGroups.nonMatchingFileNames.length) {
      console.log(
        'File names with no items: ',
        fileGroups.nonMatchingFileNames,
      );
    }
    const message = `Total: ${items.length} items found for ${fileGroups.filenameGroups.length} files!
    ${fileGroups.nonMatchingFileNames.length} files don't have matching item (listed in the console).
    Do you want to continue?`;

    this.dialogService.openConfirmDialog(message).subscribe((conf) => {
      if (!conf) {
        return;
      }

      this.uploadAndUpdate(fileGroups);
    });
  }

  @ShowLoader()
  private async fetchItems(fileNames: string[]): Promise<Item[]> {
    // To support all vales in ItemFilenameMatchStrategy,
    // this method can be changed optionally fetch
    // all items and then apply filters like contains, starts with, etc.

    const res: Item[] = [];

    for (const fileNamesBatch of ArrayUtils.splitToBatches(fileNames, 100)) {
      const query: ItemsSearchQuery = this.createQuery(fileNamesBatch);

      let page = -1;
      let hasNext = true;

      while (hasNext) {
        page++;
        query.page.page = page;
        console.log(`fetching page ${page}`);

        const wrappedResponse = await this.itemService.searchItems(
          query,
          this.envOverride,
        );

        if (!wrappedResponse.isSuccess) {
          console.log(wrappedResponse);
          alert('Could not load all pages, stopping on page' + (page + 1));
          this.dialogService.openRequestResultDialog(wrappedResponse);
          throw new Error('Aborting process!');
        }

        const beesResponse = wrappedResponse.response;

        res.push(...beesResponse.response.items);
        hasNext = beesResponse.response?.pagination?.hasNext;
      }
    }

    return res;
  }

  @ShowLoader()
  private async uploadAndUpdate(
    fileGroups: ItemFilenameMatchResults,
  ): Promise<void> {
    const failedFileNames: string[] = [];
    const succeededFileNames: string[] = [];
    let processedFilesCount = 0;

    await this.zipService.iterate(this.file!, async (name, file) => {
      const fileGroup = fileGroups.filenameGroups.find(
        (fng) => fng.filename === name,
      );

      // Skip files that don't have items for them.
      if (!fileGroup) {
        return;
      }

      const content = await file.async('base64');

      const isSuccess = await this.itemImageUploadService.uploadItemGroup(
        file.name,
        content,
        fileGroup.items,
        this.form.getRawValue().storageType,
        this.envOverride,
      );

      processedFilesCount++;
      if (!isSuccess) {
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
  }

  private createQuery(fileNames: string[]): ItemsSearchQuery {
    const query: ItemsSearchQuery = new ItemSearchQueryImpl();
    query.page.pageSize = 190;
    const fileNamesNoExt = fileNames.map((fn) =>
      FilenameUtil.trimExtension(fn),
    );

    switch (this.form.getRawValue().matchType) {
      case ItemFilenameMatchType.BEES_ID:
        query.ids.push(...fileNamesNoExt);
        break;
      case ItemFilenameMatchType.PLATFORM_ID:
        query.itemPlatformIds.push(...fileNamesNoExt);
        break;
      case ItemFilenameMatchType.SKU:
        query.vendorId = this.envOverride.vendorId;
        query.skus.push(...fileNamesNoExt);
        break;
      case ItemFilenameMatchType.VENDOR_ITEM_ID:
        query.vendorId = this.envOverride.vendorId;
        query.vendorItemIds.push(...fileNamesNoExt);
        break;
      default:
        throw new Error(
          `Unsupported match type ${this.form.getRawValue().matchType}`,
        );
    }

    return query;
  }
}

export const UPLOAD_ITEM_IMAGES_ROUTES: Routes = [
  {
    path: '',
    component: UploadItemImagesComponent,
  },
];
