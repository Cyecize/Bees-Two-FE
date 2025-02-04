import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BeesEntity } from '../../../../api/common/bees-entity';
import { RequestMethod } from '../../../../api/common/request-method';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '../../../../shared/form-controls/select/select.option';
import { SelectOptions } from '../../../../api/common/select-options';
import {
  RequestTemplateQuery,
  RequestTemplateQueryImpl,
} from '../../../../api/template/request-template.query';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import { FieldError } from '../../../../shared/field-error/field-error';

interface TemplateSearchFiltersForm {
  name: FormControl<string | null>;
  entity: FormControl<BeesEntity | null>;
  method: FormControl<RequestMethod | null>;
}

@Component({
  selector: 'app-template-search-filters',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, SelectComponent],
  templateUrl: './template-search-filters.component.html',
  styleUrl: './template-search-filters.component.scss',
})
export class TemplateSearchFiltersComponent implements OnInit {
  entityOptions: SelectOption[] = SelectOptions.beesEntityOptions();
  methodOptions: SelectOption[] = SelectOptions.methodOptions();

  form!: FormGroup<TemplateSearchFiltersForm>;

  @Input()
  initialQueryChange = true;

  @Input()
  errors: FieldError[] = [];

  @Output()
  queryChanged: EventEmitter<RequestTemplateQuery> =
    new EventEmitter<RequestTemplateQuery>();

  ngOnInit(): void {
    this.form = new FormGroup<TemplateSearchFiltersForm>(
      {
        name: new FormControl<string | null>(null),
        entity: new FormControl<BeesEntity | null>(null),
        method: new FormControl<RequestMethod | null>(null),
      },
      { updateOn: 'change' }, // TODO: try to make it work with "blur" possibly need to update custom controls
    );

    this.form.valueChanges.subscribe(() => this.onFormChange());
    if (this.initialQueryChange) {
      this.onFormChange();
    }
  }

  onFormChange(): void {
    const query: RequestTemplateQuery = new RequestTemplateQueryImpl();
    const val = this.form.getRawValue();

    query.entity = val.entity;
    query.name = val.name;
    query.method = val.method;

    this.queryChanged.emit(query);
  }
}
