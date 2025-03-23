import { FieldError } from '../field-error/field-error';
import { HttpStatus } from '../http/http-status';
import { firstValueFrom, Observable } from 'rxjs';
import { isArrayLike } from 'rxjs/internal/util/isArrayLike';

export class FieldErrorWrapperLocal<T> {
  constructor(private delegate: () => Observable<T>) {}

  async execute(): Promise<WrappedResponseLocal<T>> {
    try {
      return new WrappedResponseLocal<T>(
        true,
        [],
        await firstValueFrom<T>(this.delegate.call(null)),
      );
    } catch (err: any) {
      if (
        err.status === HttpStatus.BAD_REQUEST &&
        isArrayLike(err.error.fieldErrors)
      ) {
        return new WrappedResponseLocal<T>(
          false,
          err.error.fieldErrors as FieldError[],
        );
      }

      return new WrappedResponseLocal<T>(false, [
        {
          message: err.error?.message || 'something.went.wrong',
          field: '',
        },
      ]);
    }
  }
}

/**
 * @monaco
 */
export interface IWrappedResponseLocal<T> {
  isSuccess: boolean;
  errors: FieldError[];
  response?: T;
}

export class WrappedResponseLocal<T> implements IWrappedResponseLocal<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly errors: FieldError[],
    private readonly resp?: T,
  ) {}

  get response(): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.resp;
  }
}
