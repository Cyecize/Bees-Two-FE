import { FieldError } from '../field-error/field-error';
import { HttpStatus } from '../http/http-status';
import { firstValueFrom, Observable } from 'rxjs';
import { isArrayLike } from 'rxjs/internal/util/isArrayLike';

export class FieldErrorWrapper<T> {
  constructor(private delegate: () => Observable<T>) {}

  async execute(): Promise<WrappedResponse<T>> {
    try {
      return new WrappedResponse<T>(
        true,
        [],
        await firstValueFrom<T>(this.delegate.call(null)),
      );
    } catch (err: any) {
      if (
        err.status === HttpStatus.BAD_REQUEST &&
        isArrayLike(err.error.fieldErrors)
      ) {
        return new WrappedResponse<T>(
          false,
          err.error.fieldErrors as FieldError[],
        );
      }

      return new WrappedResponse<T>(false, [
        {
          message: err.error?.message || 'something.went.wrong',
          field: '',
        },
      ]);
    }
  }
}

export class WrappedResponse<T> {
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
