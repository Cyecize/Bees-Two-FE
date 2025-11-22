import { Pipe, PipeTransform } from '@angular/core';
import { FieldError } from './field-error';
import { ObjectUtils } from '../util/object-utils';

@Pipe({
  name: 'filterFieldError',
  standalone: true,
})
export class FilterFieldErrorPipe implements PipeTransform {
  transform(errors: FieldError[], fieldNames: string[]): FieldError[] {
    if (ObjectUtils.isNil(errors)) {
      errors = [];
    }

    return errors.filter((e) => fieldNames.includes(e.field));
  }
}
