import { Injectable } from '@angular/core';
import { InclusionPayload } from './inclusion.payload';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesResponse } from '../proxy/bees-response';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { ProductAssortmentRepository } from './product-assortment.repository';
import { RelayService } from '../relay/relay.service';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';

@Injectable({ providedIn: 'root' })
export class ProductAssortmentService {
  constructor(
    private repository: ProductAssortmentRepository,
    private relayService: RelayService,
  ) {}

  public async addAssortmentInclusion(
    payload: InclusionPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<BeesResponse<any>>(
        BeesEntity.PRODUCT_ASSORTMENT_INCLUSION,
        RequestMethod.POST,
        RelayVersion.v4,
        [],
        JSON.stringify(payload, null, 2),
        env?.id,
      ),
    ).execute();
  }
}
