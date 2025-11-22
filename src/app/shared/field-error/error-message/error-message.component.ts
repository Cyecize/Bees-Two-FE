import { Component, Input } from '@angular/core';
import { FieldError } from '../field-error';
import { FilterFieldErrorPipe } from '../filter-field-error.pipe';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-field-error',
  templateUrl: './error-message.component.html',
  standalone: true,
  imports: [FilterFieldErrorPipe, NgForOf],
})
export class ErrorMessageComponent {
  @Input() errors!: FieldError[];

  @Input()
  set fieldName(name: string) {
    this.fieldNames.push(name);
  }

  @Input() fieldNames: string[] = [];

  constructor() {}
}
