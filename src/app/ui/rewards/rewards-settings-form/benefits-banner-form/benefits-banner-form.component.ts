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
import { RewardsSettingBenefitsBannerPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface BenefitsBannerForm {
  bgColor: FormControl<string>;
  bgImage: FormGroup<BgImagesForm>;
  header: FormGroup<HeaderForm>;
  content: FormGroup<ContentForm>;
}

interface BgImagesForm {
  mobile: FormControl<string>;
  web: FormControl<string>;
}

interface HeaderForm {
  icon: FormControl<string>;
  title: FormControl<string>;
  textColor: FormControl<string>;
}

interface ContentForm {
  bgColor: FormControl<string>;
  sections: FormArray<FormGroup<SectionForm>>;
}

interface SectionForm {
  id: FormControl<string>;
  icon: FormControl<string>;
  title: FormControl<string>;
  textColor: FormControl<string>;
  position: FormControl<number>;
  items: FormArray<FormGroup<ItemForm>>;
}

interface ItemForm {
  id: FormControl<string>;
  icon: FormControl<string>;
  text: FormControl<string>;
  textColor: FormControl<string>;
  position: FormControl<number>;
}

@Component({
  selector: 'app-benefits-banner-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './benefits-banner-form.component.html',
  styleUrl: './benefits-banner-form.component.scss',
})
export class BenefitsBannerFormComponent implements OnInit {
  form!: FormGroup<BenefitsBannerForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingBenefitsBannerPayload> =
    new EventEmitter<RewardsSettingBenefitsBannerPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<BenefitsBannerForm>({
      bgColor: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bgImage: new FormGroup<BgImagesForm>({
        mobile: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        web: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      header: new FormGroup<HeaderForm>({
        icon: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        textColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        title: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      content: new FormGroup<ContentForm>({
        bgColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        sections: new FormArray<FormGroup<SectionForm>>([]),
      }),
    });

    if (this.existingSetting?.benefitsBanner) {
      this.form.patchValue(this.existingSetting.benefitsBanner);
      const sectionsLen =
        this.existingSetting.benefitsBanner.content.sections.length;

      for (let sectionInd = 0; sectionInd < sectionsLen; sectionInd++) {
        this.addSection('', '', '');

        const sectionControl = this.sections.at(sectionInd);
        const section =
          this.existingSetting.benefitsBanner.content.sections[sectionInd];
        sectionControl.patchValue(section);

        for (let itemInd = 0; itemInd < section.items.length; itemInd++) {
          this.addItem(sectionInd);
          const itemControl = this.getItems(sectionInd).at(itemInd);
          itemControl.patchValue(section.items[itemInd]);
        }
      }
    }
  }

  get sections(): FormArray {
    return this.form.get('content')?.get('sections') as FormArray;
  }

  getItems(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('items') as FormArray;
  }

  addSection(icon: string, title: string, textColor: string): void {
    const sectionItems = new FormArray<FormGroup<ItemForm>>([]);

    const sectionGroup = new FormGroup<SectionForm>({
      icon: new FormControl(icon, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      title: new FormControl(title, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      textColor: new FormControl(textColor, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      id: new FormControl(textColor, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      position: new FormControl<number>(this.sections.length + 1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      items: sectionItems,
    });

    this.sections.push(sectionGroup);
  }

  addItem(sectionIndex: number): void {
    this.getItems(sectionIndex).push(
      new FormGroup<ItemForm>({
        icon: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        text: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        textColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        id: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        position: new FormControl(this.getItems(sectionIndex).length + 1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit({
      benefitsBanner: this.form.value,
    });
  }

  removeItem(sectionInd: number, itemInd: number): void {
    this.getItems(sectionInd).removeAt(itemInd);
  }

  removeSection(sectionInd: number): void {
    this.sections.removeAt(sectionInd);
  }
}
