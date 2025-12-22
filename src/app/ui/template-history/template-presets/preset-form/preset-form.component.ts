import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import {
  RequestTemplateArg,
  RequestTemplateArgView,
} from '../../../../api/template/arg/request-template-arg';
import { CreateRequestTemplatePreset } from '../../../../api/template/arg/preset/create-request-template-preset';
import { NgForOf, NgIf } from '@angular/common';
import { TemplateArgDataType } from '../../../../api/template/arg/template-arg-data.type';
import { FieldError } from '../../../../shared/field-error/field-error';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { CountryEnvironmentService } from '../../../../api/env/country-environment.service';
import { CheckboxComponent } from '../../../../shared/form-controls/checkbox/checkbox.component';

interface CreatePresetForm {
  templateId: FormControl<number>;
  name: FormControl<string>;
  argValues: FormArray<FormGroup<PresetArgvalForm>>;
}

interface PresetArgvalForm {
  id: FormControl<number | null>;
  argId: FormControl<number>;
  value: FormControl<string | null>;
}

@Component({
  selector: 'app-preset-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    NgForOf,
    NgIf,
    TooltipSpanComponent,
    CheckboxComponent,
    FormsModule,
  ],
  templateUrl: './preset-form.component.html',
  styleUrl: './preset-form.component.scss',
})
export class PresetFormComponent implements OnInit {
  form!: FormGroup<CreatePresetForm>;

  @Input()
  templateId!: number;

  @Input()
  args!: RequestTemplateArg[];

  @Input()
  errors: FieldError[] = [];

  removeEmptyArgs = true;

  constructor(
    private dialogService: DialogService,
    private environmentService: CountryEnvironmentService,
  ) {}

  @Output()
  formSubmitted: EventEmitter<CreateRequestTemplatePreset> =
    new EventEmitter<CreateRequestTemplatePreset>();

  ngOnInit(): void {
    this.form = new FormGroup({
      templateId: new FormControl<number>(this.templateId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      name: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      argValues: new FormArray<FormGroup<PresetArgvalForm>>([]),
    });

    this.args.forEach((arg) => {
      this.addArg(arg);
    });
  }

  get argsForm(): FormArray<FormGroup<PresetArgvalForm>> {
    return this.form.controls.argValues;
  }

  onFormSubmit(): void {
    const val = this.form.getRawValue();
    if (this.removeEmptyArgs) {
      val.argValues = val.argValues.filter(
        (val) => !ObjectUtils.isNil(val.value),
      );
    }

    this.formSubmitted.emit(val);
  }

  private addArg(arg: RequestTemplateArg): void {
    this.argsForm.push(
      new FormGroup({
        argId: new FormControl<number>(arg.id!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        value: new FormControl<string | null>(null),
        id: new FormControl<number | null>(null),
      }),
    );
  }

  protected readonly TemplateArgDataType = TemplateArgDataType;

  protected getArg(argId: number): RequestTemplateArg {
    return this.args.find((arg) => arg.id === argId)!;
  }

  protected viewArgType(arg: RequestTemplateArg): void {
    this.dialogService.showFormattedContent(
      arg.customType,
      'View custom arg type!',
    );
  }

  protected showOriginalValue(arg: RequestTemplateArg): void {
    this.dialogService.showFormattedContent(
      arg.value,
      `Value for arg: ${arg.name}`,
    );
  }

  protected showCurrentValue(argFormInd: number): void {
    this.dialogService.showFormattedContent(
      this.argsForm.at(argFormInd).value.value,
      'Arg Value',
    );
  }

  protected async openNewArgPicker(): Promise<void> {
    const possibleArgs = this.args.filter((arg) =>
      ObjectUtils.isNil(
        this.argsForm.controls.find((val) => val.value.argId === arg.id),
      ),
    );

    if (!possibleArgs.length) {
      console.warn('No args to add!');
      return;
    }

    const selected = await this.dialogService.openGenericMultiselect(
      possibleArgs.map((arg) => {
        return {
          obj: arg,
          displayName: arg.name,
        };
      }),
    );

    selected.forEach((arg) => this.addArg(arg));
  }

  protected async openEditPrompt(argFormInd: number): Promise<void> {
    const argForm = this.argsForm.at(argFormInd);
    const arg: RequestTemplateArgView = JSON.parse(
      JSON.stringify(
        this.args.find((a) => a.id === argForm.controls.argId.value),
      ),
    );
    arg.value = argForm.value.value!;

    const val = await this.dialogService.openTemplateArgPrompt(
      this.environmentService.getCurrentEnv()!,
      arg,
      undefined,
      true,
    );

    argForm.patchValue({
      value: val,
    });
  }

  protected readonly alert = alert;
}
