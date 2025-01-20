import { PriceRepository } from './price.repository';
import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { SingleItemPriceV3Query } from './single-item-price-v3.query';
import { SingleItemPriceV3 } from './single-item-price-v3';
import { map } from 'rxjs/operators';
import { ObjectUtils } from '../../shared/util/object-utils';

@Injectable({ providedIn: 'root' })
export class PriceService {
  constructor(private repository: PriceRepository) {}

  public async searchPrices(
    queries: SingleItemPriceV3Query[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<SingleItemPriceV3[]>> {
    return await new FieldErrorWrapper(() =>
      this.repository.getPrices(queries, env?.id).pipe(
        map((res) => {
          if (ObjectUtils.isNil(res.response)) {
            res.response = [];
          }

          return res;
        }),
      ),
    ).execute();
  }
}
