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
import { CountryEnvironmentLanguageModel } from '../../../api/env/country-environment-language.model';
import { FieldError } from '../../../shared/field-error/field-error';

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

  hasClientAndSecret = true;

  @Input()
  payload!: CountryEnvironmentModel;

  @Input()
  errors: FieldError[] = [];

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
      languages: new FormArray<FormGroup<EnvLanguageForm>>([], {
        validators: [Validators.required],
      }),
    });

    if (this.payload) {
      this.applyEnv();

      this.form.removeControl('clientId');
      this.form.removeControl('clientSecret');
      this.hasClientAndSecret = false;
    } else {
      const defaultLanguageForm = new FormGroup<EnvLanguageForm>({
        languageCode: new FormControl<string>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        defaultLanguage: new FormControl<boolean>(true, {
          nonNullable: true,
        }),
      });

      this.form.controls.languages.push(defaultLanguageForm);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.formSubmitted.emit(this.form.getRawValue());
  }

  addNewLanguage(language?: CountryEnvironmentLanguageModel): void {
    const langForm = new FormGroup<EnvLanguageForm>({
      languageCode: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      defaultLanguage: new FormControl<boolean>(false, { nonNullable: true }),
    });

    if (language) {
      langForm.patchValue(language);
    }

    this.languages.push(langForm);
  }

  removeLanguage(ind: number): void {
    if (ind < 1) {
      return;
    }

    this.languages.removeAt(ind);
  }

  applyEnv(): void {
    this.form.patchValue(this.payload!);
    this.payload!.languages.forEach((value) => {
      this.addNewLanguage(value);
    });
  }
}
