import { firstValueFrom, Observable } from 'rxjs';
import { ErrorResponse } from '../../api/proxy/error-response';

export class FieldErrorWrapper<T> {
  constructor(private delegate: () => Observable<T>) {}

  async execute(): Promise<WrappedResponse<T>> {
    try {
      return new WrappedResponse<T>(
        true,
        undefined,
        await firstValueFrom<T>(this.delegate.call(null)),
      );
    } catch (err: any) {
      return new WrappedResponse<T>(false, err.error);
    }
  }
}

export class WrappedResponse<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly errorResp?: ErrorResponse,
    private readonly resp?: T,
  ) {}

  get response(): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.resp;
  }
}
