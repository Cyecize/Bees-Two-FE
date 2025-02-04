import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BeesEntity } from '../../../../api/common/bees-entity';
import { RequestMethod } from '../../../../api/common/request-method';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RelayVersion } from '../../../../api/relay/relay.version';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import { SelectOption } from '../../../../shared/form-controls/select/select.option';
import { ErrorMessageComponent } from '../../../../shared/field-error/error-message/error-message.component';
import { FieldError } from '../../../../shared/field-error/field-error';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { Endpoints } from '../../../../shared/http/endpoints';
import { NgForOf, NgIf } from '@angular/common';
import {
  RequestTemplate,
  RequestTemplateView,
} from '../../../../api/template/request-template';
import { SelectOptions } from '../../../../api/common/select-options';

interface TemplateForm {
  name: FormControl<string>;
  entity: FormControl<BeesEntity>;
  dataIngestionVersion: FormControl<RelayVersion | null>;
  endpoint: FormControl<string>;
  method: FormControl<RequestMethod>;
  queryParams: FormArray<FormGroup<BeesParamForm>>;
  headers: FormArray<FormGroup<BeesParamForm>>;
  payloadTemplate: FormControl<string | null>;
  saveInHistory: FormControl<boolean>;
}

interface BeesParamForm {
  name: FormControl<string>;
  value: FormControl<number | string | boolean | null>;
}

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    SelectComponent,
    ErrorMessageComponent,
    CheckboxComponent,
    EnvOverrideFieldComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss',
})
export class TemplateFormComponent implements OnInit {
  private _template!: RequestTemplateView;
  form!: FormGroup<TemplateForm>;

  @Input()
  errors: FieldError[] = [];

  @Input({ required: false })
  set template(template: RequestTemplateView) {
    this._template = template;
    if (this.form) {
      this.populateTemplate(template);
    }
  }

  get template(): RequestTemplateView {
    return this._template;
  }

  entityOptions: SelectOption[] = SelectOptions.beesEntityOptions();
  dataIngestionVersions: SelectOption[] =
    SelectOptions.dataIngestionVersionOptions();
  methodOptions: SelectOption[] = SelectOptions.methodOptions();

  @Output()
  formSubmitted: EventEmitter<RequestTemplate> =
    new EventEmitter<RequestTemplate>();

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup<TemplateForm>({
      name: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      entity: new FormControl<BeesEntity>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      dataIngestionVersion: new FormControl<RelayVersion | null>(null!),
      endpoint: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      method: new FormControl<RequestMethod>(RequestMethod.POST, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      queryParams: new FormArray<FormGroup<BeesParamForm>>([]),
      headers: new FormArray<FormGroup<BeesParamForm>>([]),
      payloadTemplate: new FormControl<string | null>(null),
      saveInHistory: new FormControl<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    if (this.template) {
      this.populateTemplate(this.template);
    }
  }

  get relayVersion(): RelayVersion | null {
    return this.form.controls.dataIngestionVersion.value;
  }

  relayVersionChanges(val: RelayVersion): void {
    if (!ObjectUtils.isNil(val)) {
      this.form.patchValue({
        endpoint: Endpoints.DATA_INGESTION,
      });

      return;
    }

    if (this.form.controls.endpoint.value === Endpoints.DATA_INGESTION) {
      this.form.patchValue({
        endpoint: null!,
      });
    }
  }

  addHeader(): void {
    this.form.controls.headers.push(this.createBeesFormGroup());
  }

  addQueryParam(): void {
    this.form.controls.queryParams.push(this.createBeesFormGroup());
  }

  private createBeesFormGroup(): FormGroup<BeesParamForm> {
    return new FormGroup<BeesParamForm>({
      name: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      value: new FormControl<string | null>(null),
    });
  }

  private populateTemplate(template: RequestTemplateView): void {
    this.form.patchValue({
      endpoint: template.endpoint,
      entity: template.entity,
      name: template.name,
      method: template.method,
      payloadTemplate: template.payloadTemplate,
      dataIngestionVersion: template.dataIngestionVersion,
      saveInHistory: template.saveInHistory,
    });

    if (template.headers?.length) {
      template.headers.forEach((h) => {
        const headerForm = this.createBeesFormGroup();
        headerForm.patchValue(h);
        this.form.controls.headers.push(headerForm);
      });
    }

    if (template.queryParams?.length) {
      template.queryParams.forEach((h) => {
        const queryParamsForm = this.createBeesFormGroup();
        queryParamsForm.patchValue(h);
        this.form.controls.queryParams.push(queryParamsForm);
      });
    }
  }

  async onFormSubmit(): Promise<void> {
    this.formSubmitted.emit(this.form.getRawValue());
  }
}
