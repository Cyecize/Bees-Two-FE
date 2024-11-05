import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnvForm, EnvLanguageForm } from './env.form';
import { Env } from '../../../api/env/env';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { CountryEnvironmentPayload } from '../../../api/env/country-environment.payload';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-env-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './env-form.component.html',
  styleUrl: './env-form.component.scss',
})
export class EnvFormComponent implements OnInit {
  form!: FormGroup<EnvForm>;
  envs: SelectOption[] = [];

  @Input()
  payload?: CountryEnvironmentModel;

  @Output()
  formSubmitted = new EventEmitter<CountryEnvironmentPayload>();

  constructor() {}

  ngOnInit(): void {
    this.envs = [new SelectOptionKey('Choose one', true)].concat(
      ...Object.keys(Env).map((key) => new SelectOptionKey(key)),
    );

    this.form = new FormGroup<EnvForm>({
      envName: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      env: new FormControl<Env>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      countryCode: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      timezone: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      storeId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vendorId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      clientId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      clientSecret: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      languages: new FormArray<FormGroup<EnvLanguageForm>>(
        [
          new FormGroup<EnvLanguageForm>({
            languageCode: new FormControl<string>(null!, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            defaultLanguage: new FormControl<boolean>(true, {
              nonNullable: true,
            }),
          }),
        ],
        {
          validators: [Validators.required],
        },
      ),
    });

    if (this.payload) {
      this.form.patchValue(this.payload);
      //TODO: Patch the languages too
    }
  }

  get languages(): FormArray<FormGroup<EnvLanguageForm>> {
    return this.form.controls.languages;
  }

  get secondaryLanguages(): FormGroup<EnvLanguageForm>[] {
    if (this.languages.length <= 1) {
      return [];
    }

    return this.languages.controls.filter((ctr) => !ctr.value.defaultLanguage);
  }

  defaultLanguageChanged(val: string): void {
    this.languages.at(0).patchValue({ languageCode: val });
  }

  onFormSubmit(): void {
    this.formSubmitted.emit(this.form.getRawValue());
  }

  addNewLanguage(): void {
    this.languages.push(
      new FormGroup<EnvLanguageForm>({
        languageCode: new FormControl<string>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        defaultLanguage: new FormControl<boolean>(false, { nonNullable: true }),
      }),
    );
  }

  removeLanguage(ind: number): void {
    if (ind < 1) {
      return;
    }

    this.languages.removeAt(ind);
  }
}
