import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { NgForOf } from '@angular/common';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingCategoriesPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface CategoriesForm {
  categories: FormArray<FormGroup<CategoryForm>>;
}

interface CategoryForm {
  categoryId: FormControl<string>;
  categoryIdWeb: FormControl<string>;
  storeId: FormControl<string>;
  description: FormControl<string>;
  buttonLabel: FormControl<string>;
  buttonName: FormControl<string>;
  image: FormControl<string>;
  title: FormControl<string>;
  titleClubB: FormControl<string>;
  subtitle: FormControl<string>;
  headerImage: FormControl<string>;
  headerImageClubB: FormControl<string>;
  position: FormControl<number>;
  brands: FormArray<FormGroup<BrandForm>>;
}

interface BrandForm {
  brandId: FormControl<string>;
  title: FormControl<string>;
  image: FormControl<string>;
}

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup<CategoriesForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingCategoriesPayload> =
    new EventEmitter<RewardsSettingCategoriesPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<CategoriesForm>({
      categories: new FormArray<FormGroup<CategoryForm>>([]),
    });

    if (this.existingSetting?.categories) {
      this.form.patchValue({ categories: this.existingSetting.categories });
      const categoriesLen = this.existingSetting.categories.length;

      for (let categoryInd = 0; categoryInd < categoriesLen; categoryInd++) {
        this.addCategory();

        const categoryControl = this.categories.at(categoryInd);
        const category = this.existingSetting.categories[categoryInd];
        categoryControl.patchValue(category);

        const brandsLen = category.brands.length;
        for (let brandInd = 0; brandInd < brandsLen; brandInd++) {
          this.addBrand(categoryInd);
          const brandControl = this.getBrands(categoryInd).at(brandInd);
          brandControl.patchValue(category.brands[brandInd]);
        }
      }
    }
  }

  get categories(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  getBrands(categoryIndex: number): FormArray {
    return this.categories.at(categoryIndex).get('brands') as FormArray;
  }

  addCategory(): void {
    const categoryGroup = new FormGroup<CategoryForm>({
      categoryId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categoryIdWeb: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      storeId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      buttonLabel: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      buttonName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      image: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      titleClubB: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      subtitle: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      headerImage: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      headerImageClubB: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      position: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      brands: new FormArray<FormGroup<BrandForm>>([]),
    });

    this.categories.push(categoryGroup);
  }

  addBrand(categoryIndex: number): void {
    this.getBrands(categoryIndex).push(
      new FormGroup<BrandForm>({
        brandId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        title: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        image: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeCategory(categoryInd: number): void {
    this.categories.removeAt(categoryInd);
  }

  removeBrand(categoryIndex: number, brandInd: number): void {
    this.getBrands(categoryIndex).removeAt(brandInd);
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit(this.form.getRawValue());
  }
}
