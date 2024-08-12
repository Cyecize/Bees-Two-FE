import { Injectable } from '@angular/core';
import { PromoRepository } from './promo.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesResponse } from '../proxy/bees-response';
import { firstValueFrom } from 'rxjs';
import { PromoSearchQuery } from './promo-search.query';
import { PromoSearchResponse } from './promo-search.response';
import { PromoV3Payload } from './promo-v3.payload';
import { RelayService } from '../relay/relay.service';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';

@Injectable({ providedIn: 'root' })
export class PromoService {
  constructor(
    private promoRepository: PromoRepository,
    private relayService: RelayService,
  ) {}

  public async searchPromos(
    query: PromoSearchQuery,
    env?: CountryEnvironmentModel,
  ): Promise<BeesResponse<PromoSearchResponse>> {
    return firstValueFrom(this.promoRepository.searchPromos(query, env?.id));
  }

  public async addPromo(
    payload: PromoV3Payload[],
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<any>(
        BeesEntity.PROMOTIONS,
        RequestMethod.POST,
        RelayVersion.V3,
        [],
        JSON.stringify(payload),
        env?.id,
      ),
    ).execute();
  }
}
