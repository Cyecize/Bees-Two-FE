import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestTemplatePresetService } from '../../../../api/template/arg/preset/request-template-preset.service';
import {
  RequestTemplatePresetQuery,
  RequestTemplatePresetQueryImpl,
} from '../../../../api/template/arg/preset/request-template-preset.query';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShowLoader } from '../../../../shared/loader/show.loader.decorator';
import {
  EmptyPage,
  Page,
  pageToPagination,
} from '../../../../shared/util/page';
import { RequestTemplatePreset } from '../../../../api/template/arg/preset/request-template-preset';
import { FieldError } from '../../../../shared/field-error/field-error';
import { ErrorMessageComponent } from '../../../../shared/field-error/error-message/error-message.component';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { RequestTemplateArgView } from '../../../../api/template/arg/request-template-arg';
import { CreatePresetDialogComponent } from '../create-preset-dialog/create-preset-dialog.component';
import { CreatePresetDialogPayload } from '../create-preset-dialog/create-preset-dialog.payload';
import { RequestTemplateService } from '../../../../api/template/request-template.service';

interface SearchPresetForm {
  templateId: FormControl<number>;
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-preset-search',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    InputComponent,
    NgForOf,
    TooltipSpanComponent,
    ReactiveFormsModule,
    PaginationComponent,
    NgIf,
  ],
  templateUrl: './preset-search.component.html',
  styleUrl: './preset-search.component.scss',
})
export class PresetSearchComponent implements OnInit {
  private _templateId!: number;

  query: RequestTemplatePresetQuery = new RequestTemplatePresetQueryImpl();
  form!: FormGroup<SearchPresetForm>;
  response: Page<RequestTemplatePreset> = new EmptyPage();
  errors: FieldError[] = [];

  @Input()
  set templateId(value: number) {
    this._templateId = value;
  }

  get templateId(): number {
    return this._templateId;
  }

  @Input()
  argValues: RequestTemplateArgView[] = [];

  @Input()
  selectedPreset?: RequestTemplatePreset;

  @Output()
  presetSelected: EventEmitter<RequestTemplatePreset | null> =
    new EventEmitter();

  constructor(
    private presetService: RequestTemplatePresetService,
    private requestTemplateService: RequestTemplateService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl<string | null>(null),
        templateId: new FormControl<number>(null!, {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      { updateOn: 'change' },
    );

    this.form.valueChanges.subscribe(() => {
      void this.onFormChange();
    });

    if (this.templateId) {
      this.form.patchValue({ templateId: this.templateId });
    }
  }

  async onFormChange(): Promise<void> {
    const rawVal = this.form.getRawValue();

    this.query.name = rawVal.name;
    this.query.templateId = rawVal.templateId;

    await this.reloadFilters();
  }

  async reloadFilters(): Promise<void> {
    this.query.page.pageNumber = 0;
    await this.fetchData();
  }

  async pageChange(page: number): Promise<void> {
    this.query.page.pageNumber = page;
    await this.fetchData();
  }

  @ShowLoader()
  async fetchData(): Promise<void> {
    if (!this.query.templateId) {
      console.warn('No templateId set, aborting search!');
      return;
    }

    this.response = new EmptyPage();
    const resp = await this.presetService.searchPresets(this.query);

    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.response = resp.response;
    }
  }

  protected readonly pageToPagination = pageToPagination;

  protected async openDetailsDialog(
    preset: RequestTemplatePreset,
  ): Promise<void> {
    const selected = await this.dialogService.openTemplatePresetDetails(
      preset,
      this.argValues,
    );

    if (selected) {
      this.selectPreset(preset);
    }

    void this.reloadFilters();
  }

  selectPreset(preset: RequestTemplatePreset | null): void {
    this.presetSelected.next(preset);
  }

  async openCreatePresetDialog(): Promise<void> {
    const template = await this.requestTemplateService.getTemplate(
      this.templateId,
    );

    if (!template.isSuccess) {
      alert('Could not fetch template!');
      console.error(template);
      return;
    }

    this.dialogService
      .open(
        CreatePresetDialogComponent,
        'Create Preset',
        new CreatePresetDialogPayload(template.response),
      )
      .afterClosed()
      .subscribe((refresh) => {
        if (refresh) {
          void this.reloadFilters();
        }
      });
  }
}
