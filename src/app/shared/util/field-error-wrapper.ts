import { firstValueFrom, Observable } from 'rxjs';
import { ErrorResponse } from '../../api/proxy/error-response';
import { BeesResponse } from '../../api/proxy/bees-response';

export class FieldErrorWrapper<T> {
  constructor(private delegate: () => Observable<BeesResponse<T>>) {}

  async execute(): Promise<WrappedResponse<T>> {
    try {
      return new WrappedResponse<T>(
        true,
        undefined,
        await firstValueFrom(this.delegate.call(null)),
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
    private readonly resp?: BeesResponse<T>,
  ) {}

  get response(): BeesResponse<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.resp;
  }
}
