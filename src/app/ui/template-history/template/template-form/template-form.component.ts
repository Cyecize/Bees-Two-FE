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
import { RequestTemplateArgType } from '../../../../api/template/arg/request-template-arg.type';
import { RequestTemplatePayloadType } from '../../../../api/template/request-template-payload.type';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { TemplatePlaygroundDialogPayload } from '../template-payload-playground-dialog/template-playground-dialog.payload';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { StringUtils } from '../../../../shared/util/string-utils';

interface TemplateForm {
  name: FormControl<string>;
  entity: FormControl<BeesEntity>;
  dataIngestionVersion: FormControl<RelayVersion | null>;
  endpoint: FormControl<string | null>;
  method: FormControl<RequestMethod | null>;
  makeRequest: FormControl<boolean>;
  queryParams: FormArray<FormGroup<BeesParamForm>>;
  headers: FormArray<FormGroup<BeesParamForm>>;
  payloadTemplate: FormControl<string | null>;
  payloadType: FormControl<RequestTemplatePayloadType>;
  preRequestScript: FormControl<string | null>;
  postRequestScript: FormControl<string | null>;
  saveInHistory: FormControl<boolean>;
  arguments: FormArray<FormGroup<TemplateArgForm>>;
}

interface BeesParamForm {
  name: FormControl<string>;
  value: FormControl<number | string | boolean | null>;
}

interface TemplateArgForm {
  id: FormControl<number | null>;
  type: FormControl<RequestTemplateArgType>;
  keyName: FormControl<string>;
  value: FormControl<string | null>;
  name: FormControl<string>;
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

  isValueFieldDisabled(ind: number): boolean {
    return (
      this.form.controls.arguments.at(ind).controls.type.value ===
      RequestTemplateArgType.PROMPT
    );
  }

  entityOptions: SelectOption[] = SelectOptions.beesEntityOptions();
  dataIngestionVersions: SelectOption[] =
    SelectOptions.dataIngestionVersionOptions();
  methodOptions: SelectOption[] = SelectOptions.methodOptions();
  argTypeOptions = SelectOptions.templateArgTypes();
  templatePayloadTypes = SelectOptions.templatePayloadTypes();

  @Output()
  formSubmitted: EventEmitter<RequestTemplate> =
    new EventEmitter<RequestTemplate>();

  constructor(
    private dialogService: DialogService,
    private envService: CountryEnvironmentService,
  ) {}

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
      endpoint: new FormControl<string | null>(null),
      makeRequest: new FormControl<boolean>(true, {
        validators: Validators.required,
        nonNullable: true,
      }),
      method: new FormControl<RequestMethod | null>(RequestMethod.POST),
      queryParams: new FormArray<FormGroup<BeesParamForm>>([]),
      headers: new FormArray<FormGroup<BeesParamForm>>([]),
      payloadTemplate: new FormControl<string | null>(null),
      payloadType: new FormControl<RequestTemplatePayloadType>(
        RequestTemplatePayloadType.ANGULAR_TEMPLATE,
        {
          validators: [Validators.required],
          nonNullable: true,
        },
      ),
      preRequestScript: new FormControl<string | null>(null),
      postRequestScript: new FormControl<string | null>(null),
      saveInHistory: new FormControl<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      arguments: new FormArray<FormGroup<TemplateArgForm>>([]),
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

  addTemplateArg(): void {
    this.form.controls.arguments.push(this.createTemplateArgFormGroup());
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

  private createTemplateArgFormGroup(): FormGroup<TemplateArgForm> {
    return new FormGroup<TemplateArgForm>({
      keyName: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      type: new FormControl<RequestTemplateArgType>(
        RequestTemplateArgType.STATIC,
        {
          validators: [Validators.required],
          nonNullable: true,
        },
      ),
      name: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      id: new FormControl<number | null>(null),
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
      preRequestScript: template.preRequestScript,
      postRequestScript: template.postRequestScript,
      payloadType: template.payloadType,
      makeRequest: template.makeRequest,
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

    if (template.arguments?.length) {
      template.arguments.forEach((arg) => {
        const form = this.createTemplateArgFormGroup();
        form.patchValue(arg);
        this.form.controls.arguments.push(form);
        if (form.controls.type.value === RequestTemplateArgType.PROMPT) {
          form.controls.value.disable();
        }
      });
    }
  }

  async onFormSubmit(): Promise<void> {
    const template: RequestTemplate = this.form.getRawValue();
    template.endpoint = StringUtils.trimToNull(template.endpoint);

    this.formSubmitted.emit(template);
  }

  onArgTypeChange(i: number, val: RequestTemplateArgType): void {
    if (val === RequestTemplateArgType.PROMPT) {
      this.form.controls.arguments.at(i).controls.value.setValue(null);
    }
  }

  openTemplateContentPlayground(): void {
    if (
      this.form.controls.payloadType.value !==
      RequestTemplatePayloadType.JAVASCRIPT
    ) {
      alert('Please choose JavaScript type!');
      return;
    }

    this.dialogService
      .openCodePlayground(
        new TemplatePlaygroundDialogPayload(
          this.form.controls.payloadTemplate.value,
          this.form.getRawValue().arguments,
          this.envService.getCurrentEnv()!,
        ),
      )
      .subscribe((res) => {
        if (res) {
          this.form.controls.payloadTemplate.patchValue(res.code);
        }
      });
  }

  openPreRequestScriptPlayground(): void {
    this.dialogService
      .openCodePlayground(
        new TemplatePlaygroundDialogPayload(
          this.form.controls.preRequestScript.value,
          this.form.getRawValue().arguments,
          this.envService.getCurrentEnv()!,
        ),
      )
      .subscribe((res) => {
        if (res) {
          this.form.controls.preRequestScript.patchValue(res.code);
        }
      });
  }

  openPostRequestScriptPlayground(): void {
    this.dialogService
      .openCodePlayground(
        new TemplatePlaygroundDialogPayload(
          this.form.controls.postRequestScript.value,
          this.form.getRawValue().arguments,
          this.envService.getCurrentEnv()!,
        ),
      )
      .subscribe((res) => {
        if (res) {
          this.form.controls.postRequestScript.patchValue(res.code);
        }
      });
  }

  onMakeRequestChange(makeRequest: boolean): void {
    if (makeRequest) {
      // TODO: Fix this, currently nulls accepted and UI does not always show the warning underscore
      this.form.controls.endpoint.addValidators([Validators.required]);
      this.form.controls.method.addValidators([Validators.required]);
      this.form.controls.entity.setValue(null!);
    } else {
      this.form.controls.endpoint.clearValidators();
      this.form.controls.method.clearValidators();

      this.form.controls.endpoint.setValue(null);
      this.form.controls.method.setValue(null);
      this.form.controls.dataIngestionVersion.setValue(null);
      this.form.controls.entity.setValue(BeesEntity.NON_REQUEST_TEMPLATE);
    }
  }
}
