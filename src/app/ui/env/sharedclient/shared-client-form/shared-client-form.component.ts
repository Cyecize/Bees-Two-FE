import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedClientForm } from './shared-client.form';
import { NgForOf, NgIf } from '@angular/common';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import { SelectOption } from '../../../../shared/form-controls/select/select.option';
import { SharedClient } from '../../../../api/env/sharedclient/shared-client';
import { SharedClientPayload } from '../../../../api/env/sharedclient/shared-client.payload';
import { Env } from '../../../../api/env/env';
import { BeesEntity } from '../../../../api/common/bees-entity';
import { FieldError } from '../../../../shared/field-error/field-error';
import { SelectSearchComponent } from '../../../../shared/form-controls/select-search/select-search.component';
import { SelectOptions } from '../../../../api/common/select-options';
import { SharedClientSupportedMethod } from '../../../../api/env/sharedclient/shared-client-supported-method';
import { ErrorMessageComponent } from '../../../../shared/field-error/error-message/error-message.component';

@Component({
  selector: 'app-shared-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    NgForOf,
    NgIf,
    SelectSearchComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './shared-client-form.component.html',
  styleUrl: './shared-client-form.component.scss',
})
export class SharedClientFormComponent implements OnInit {
  form!: FormGroup<SharedClientForm>;
  envs: SelectOption[] = SelectOptions.envOptions();

  targetEntityOptions: SelectOption[] = SelectOptions.beesEntityOptions();
  supportedMethodsOptions: SelectOption[] =
    SelectOptions.sharedClientSupportedMethodsOptions();

  @Input()
  payload?: SharedClient;

  @Input()
  errors: FieldError[] = [];

  @Output()
  formSubmitted = new EventEmitter<SharedClientPayload>();

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup<SharedClientForm>({
      name: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      env: new FormControl<Env>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      countryCode: new FormControl<string | null>(null),
      vendorId: new FormControl<string | null>(null),
      clientId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      clientSecret: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      targetEntities: new FormArray<FormControl<BeesEntity>>(
        [],
        Validators.required,
      ),
      requestMethods: new FormArray<FormControl<SharedClientSupportedMethod>>(
        [],
        Validators.required,
      ),
    });

    if (this.payload) {
      this.form.patchValue(this.payload);
      // TODO: Patch the entities too?
      // TODO: Patch the request methods too?
    }
  }

  onFormSubmit(): void {
    this.formSubmitted.emit(this.form.getRawValue());
  }

  get targetEntities(): FormArray<FormControl<BeesEntity>> {
    return this.form.controls.targetEntities;
  }

  addNewEntity(entity: BeesEntity): void {
    this.form.controls.targetEntities.push(
      new FormControl<BeesEntity>(entity, { nonNullable: true }),
    );
  }

  removeEntity(ind: number): void {
    this.form.controls.targetEntities.removeAt(ind);
  }

  get requestMethods(): FormArray<FormControl<SharedClientSupportedMethod>> {
    return this.form.controls.requestMethods;
  }

  addNewMethod(method: SharedClientSupportedMethod): void {
    this.requestMethods.push(
      new FormControl<SharedClientSupportedMethod>(method, {
        nonNullable: true,
      }),
    );
  }

  removeMethod(ind: number): void {
    this.requestMethods.removeAt(ind);
  }
}
