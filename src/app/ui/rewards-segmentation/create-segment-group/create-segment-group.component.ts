import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { SegmentationService } from '../../../api/rewards/segmentation/segmentation.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { OverrideAuthTokenFieldComponent } from '../../env/token/override-auth-token-field/override-auth-token-field.component';

interface SegmentGroupForm {
  groupId: FormControl<string | null>;
  groupDescription: FormControl<string | null>;
  purpose: FormControl<string | null>;
  groupName: FormControl<string>;
  pocs: FormArray<FormGroup<SegmentGroupPocsForm>>;
}

interface SegmentGroupPocsForm {
  pocId: FormControl<string>;
  points: FormControl<number | null>;
  quantity: FormControl<number | null>;
}

@Component({
  selector: 'app-create-segment-group',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    ReactiveFormsModule,
    InputComponent,
    NgIf,
    SelectComponent,
    FormsModule,
    NgForOf,
    OverrideAuthTokenFieldComponent,
  ],
  templateUrl: './create-segment-group.component.html',
  styleUrl: './create-segment-group.component.scss',
})
export class CreateSegmentGroupComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<SegmentGroupForm>;
  pocsToAdd!: number;
  overrideAuthToken: string | undefined;

  constructor(
    private envOverrideService: EnvOverrideService,
    private segmentationService: SegmentationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      if (!ObjectUtils.isNil(this.envOverride)) {
        // this.reloadFilters();
      }
    });

    this.form = new FormGroup<SegmentGroupForm>({
      groupName: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      groupDescription: new FormControl<string | null>(null),
      groupId: new FormControl<string | null>(null),
      purpose: new FormControl<string | null>(null),
      pocs: new FormArray<FormGroup<SegmentGroupPocsForm>>([], {
        validators: Validators.required,
      }),
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  setPocsToAdd(pocsToAdd: number): void {
    this.pocsToAdd = pocsToAdd;
  }

  addPocsArray(val: string): void {
    val = val?.trim();

    if (!val) {
      return;
    }

    let data: string[];

    try {
      data = JSON.parse(val) as string[];
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    data
      .map((val) => val.trim())
      .forEach((val) => {
        const group = this.addPocForm();
        group.controls.pocId.patchValue(val);
      });
  }

  addPocs(): void {
    if (!this.pocsToAdd) {
      return;
    }

    for (let i = 0; i < this.pocsToAdd; i++) {
      this.addPocForm();
    }
  }

  addPocForm(): FormGroup<SegmentGroupPocsForm> {
    const group = new FormGroup<SegmentGroupPocsForm>({
      pocId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: Validators.required,
      }),
      points: new FormControl<number | null>(null),
      quantity: new FormControl<number | null>(null),
    });

    this.form.controls.pocs.push(group);

    return group;
  }

  async formSubmitted(): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        `You are about to create segmentation group on env: ${this.envOverride?.envName}`,
      )
      .subscribe(async (confirmed) => {
        if (confirmed) {
          this.upsertGroup();
        }
      });
  }

  @ShowLoader()
  private async upsertGroup(): Promise<void> {
    const result = await this.segmentationService.upsertGroup(
      this.form.getRawValue(),
      this.overrideAuthToken!,
      this.envOverride,
    );

    this.dialogService.openRequestResultDialog(result);
  }

  removePocForm(i: number): void {
    this.form.controls.pocs.removeAt(i);
  }

  pickAccount(ind: number): void {
    this.dialogService.openAccountPicker(this.envOverride!).subscribe((acc) => {
      if (acc) {
        this.form.controls.pocs.at(ind).controls.pocId.patchValue(acc.beesId);
      }
    });
  }
}

export const CREATE_SEGMENT_GROUP_ROUTES: Routes = [
  {
    path: '',
    component: CreateSegmentGroupComponent,
  },
];
