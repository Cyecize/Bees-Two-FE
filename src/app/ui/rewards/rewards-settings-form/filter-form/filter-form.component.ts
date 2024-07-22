import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingFilterPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';
import { NgForOf } from '@angular/common';

interface FilterForm {
  inclusion: FormGroup<InclusionForm>;
  exclusion: FormGroup<ExclusionForm>;
}

interface InclusionForm {
  potential: FormArray<FormControl<string>>;
  segment: FormArray<FormControl<string>>;
  subsegment: FormArray<FormControl<string>>;
  vendorIds: FormArray<FormControl<string>>;
  groupIds: FormArray<FormControl<string>>;
}

interface ExclusionForm {
  groupIds: FormArray<FormControl<string>>;
}

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent implements OnInit {
  form!: FormGroup<FilterForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingFilterPayload> =
    new EventEmitter<RewardsSettingFilterPayload>();

  ngOnInit(): void {
    this.form = new FormGroup<FilterForm>({
      inclusion: new FormGroup<InclusionForm>({
        potential: new FormArray<FormControl<string>>([]),
        segment: new FormArray<FormControl<string>>([]),
        subsegment: new FormArray<FormControl<string>>([]),
        vendorIds: new FormArray<FormControl<string>>([]),
        groupIds: new FormArray<FormControl<string>>([]),
      }),
      exclusion: new FormGroup<ExclusionForm>({
        groupIds: new FormArray<FormControl<string>>([]),
      }),
    });

    if (this.existingSetting?.filter) {
      this.patchFormValues(this.existingSetting.filter);
    }
  }

  patchFormValues(filter: any): void {
    const { inclusion, exclusion } = filter;

    if (inclusion) {
      this.patchFormArrayValues(this.potentialArray, inclusion.potential);
      this.patchFormArrayValues(this.segmentArray, inclusion.segment);
      this.patchFormArrayValues(this.subsegmentArray, inclusion.subsegment);
      this.patchFormArrayValues(this.vendorIdArray, inclusion.vendorIds);
      this.patchFormArrayValues(this.groupIdArray, inclusion.groupIds);
    }

    if (exclusion) {
      this.patchFormArrayValues(this.exclusionGroupIdArray, exclusion.groupIds);
    }
  }

  patchFormArrayValues(formArray: FormArray, values: string[]): void {
    if (values) {
      formArray.clear();
      values.forEach((value) =>
        formArray.push(
          new FormControl(value, {
            nonNullable: true,
            validators: [Validators.required],
          }),
        ),
      );
    }
  }

  get potentialArray(): FormArray {
    return this.form.get('inclusion.potential') as FormArray;
  }

  get segmentArray(): FormArray {
    return this.form.get('inclusion.segment') as FormArray;
  }

  get subsegmentArray(): FormArray {
    return this.form.get('inclusion.subsegment') as FormArray;
  }

  get vendorIdArray(): FormArray {
    return this.form.get('inclusion.vendorIds') as FormArray;
  }

  get groupIdArray(): FormArray {
    return this.form.get('inclusion.groupIds') as FormArray;
  }

  get exclusionGroupIdArray(): FormArray {
    return this.form.get('exclusion.groupIds') as FormArray;
  }

  addPotential(): void {
    this.potentialArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addSegment(): void {
    this.segmentArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addSubsegment(): void {
    this.subsegmentArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addVendorId(): void {
    this.vendorIdArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addGroupId(): void {
    this.groupIdArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addExclusionGroupId(): void {
    this.exclusionGroupIdArray.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  removePotential(index: number): void {
    this.potentialArray.removeAt(index);
  }

  removeSegment(index: number): void {
    this.segmentArray.removeAt(index);
  }

  removeSubsegment(index: number): void {
    this.subsegmentArray.removeAt(index);
  }

  removeVendorId(index: number): void {
    this.vendorIdArray.removeAt(index);
  }

  removeGroupId(index: number): void {
    this.groupIdArray.removeAt(index);
  }

  removeExclusionGroupId(index: number): void {
    this.exclusionGroupIdArray.removeAt(index);
  }

  async onFormSubmit(): Promise<void> {
    // Ensure the form submissions emit the correct structure
    this.formSubmitted.emit({
      filter: this.form.getRawValue(),
    });
  }
}
