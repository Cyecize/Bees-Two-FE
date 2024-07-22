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
import { RewardsSettingEnrollmentPagePayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface EnrollmentPageForm {
  title: FormControl<string>;
  subtitle: FormControl<string>;
  bgColor: FormControl<string>;
  titleTextColor: FormControl<string>;
  subtitleTextColor: FormControl<string>;
  image: FormGroup<ImageForm>;
  content: FormGroup<ContentForm>;
  footer: FormGroup<FooterForm>;
}

interface ImageForm {
  ios: FormControl<string>;
  android: FormControl<string>;
  web: FormControl<string>;
}

interface ContentForm {
  bgColor: FormControl<string>;
  titleTextColor: FormControl<string>;
  descriptionTextColor: FormControl<string>;
  items: FormArray<FormGroup<ItemForm>>;
}

interface ItemForm {
  id: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  position: FormControl<number>;
  icon: FormGroup<IconForm>;
}

interface IconForm {
  ios: FormControl<string>;
  android: FormControl<string>;
  web: FormControl<string>;
}

interface FooterForm {
  textButton: FormControl<string>;
  buttonStyle: FormControl<string>;
}

@Component({
  selector: 'app-enrollment-page-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './enrollment-page-form.component.html',
  styleUrls: ['./enrollment-page-form.component.scss'],
})
export class EnrollmentPageFormComponent implements OnInit {
  form!: FormGroup<EnrollmentPageForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingEnrollmentPagePayload> =
    new EventEmitter<RewardsSettingEnrollmentPagePayload>();

  ngOnInit(): void {
    this.form = new FormGroup<EnrollmentPageForm>({
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      subtitle: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bgColor: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      titleTextColor: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      subtitleTextColor: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      image: new FormGroup<ImageForm>({
        ios: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        android: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        web: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      content: new FormGroup<ContentForm>({
        bgColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        titleTextColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        descriptionTextColor: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        items: new FormArray<FormGroup<ItemForm>>([]),
      }),
      footer: new FormGroup<FooterForm>({
        textButton: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        buttonStyle: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    if (this.existingSetting?.enrollmentPage) {
      this.form.patchValue(this.existingSetting.enrollmentPage);
      const itemsLen = this.existingSetting.enrollmentPage.content.items.length;

      for (let itemInd = 0; itemInd < itemsLen; itemInd++) {
        this.addItem();

        const itemControl = this.items.at(itemInd);
        const item = this.existingSetting.enrollmentPage.content.items[itemInd];
        itemControl.patchValue(item);
      }
    }
  }

  get items(): FormArray {
    return this.form.get('content')?.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = new FormGroup<ItemForm>({
      id: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      position: new FormControl(this.items.length, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      icon: new FormGroup<IconForm>({
        ios: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        android: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        web: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    this.items.push(itemGroup);
  }

  removeItem(itemInd: number): void {
    this.items.removeAt(itemInd);
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit({
      enrollmentPage: this.form.getRawValue(),
    });
  }
}
