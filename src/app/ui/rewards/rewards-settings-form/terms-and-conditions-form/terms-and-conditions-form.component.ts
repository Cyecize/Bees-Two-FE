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
import { RewardsSettingTermsAndConditionsPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';

interface TermsAndConditionsForm {
  termsAndConditions: FormArray<FormGroup<TermForm>>;
}

interface TermForm {
  versionId: FormControl<string>;
  documentDate: FormControl<string>;
  startDate: FormControl<string>;
  documentURL: FormControl<string>;
  changeLog: FormControl<string>;
  lastModified: FormControl<string>;
}

@Component({
  selector: 'app-terms-and-conditions-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './terms-and-conditions-form.component.html',
  styleUrls: ['./terms-and-conditions-form.component.scss'],
})
export class TermsAndConditionsFormComponent implements OnInit {
  form!: FormGroup<TermsAndConditionsForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingTermsAndConditionsPayload> =
    new EventEmitter<RewardsSettingTermsAndConditionsPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<TermsAndConditionsForm>({
      termsAndConditions: new FormArray<FormGroup<TermForm>>([]),
    });

    if (this.existingSetting?.termsAndConditions) {
      this.form.patchValue({
        termsAndConditions: this.existingSetting.termsAndConditions,
      });
      const termsLen = this.existingSetting.termsAndConditions.length;

      for (let termInd = 0; termInd < termsLen; termInd++) {
        this.addTerm();

        const termControl = this.termsAndConditions.at(termInd);
        const term = this.existingSetting.termsAndConditions[termInd];
        termControl.patchValue(term);
      }
    }
  }

  get termsAndConditions(): FormArray {
    return this.form.get('termsAndConditions') as FormArray;
  }

  addTerm(): void {
    const termGroup = new FormGroup<TermForm>({
      versionId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      documentDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      startDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      documentURL: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      changeLog: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastModified: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.termsAndConditions.push(termGroup);
  }

  removeTerm(termInd: number): void {
    this.termsAndConditions.removeAt(termInd);
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit(this.form.getRawValue());
  }
}
