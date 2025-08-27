import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { AccountV2Payload } from './account-v2.payload';
import { RelayService } from '../../relay/relay.service';
import { RequestMethod } from '../../common/request-method';
import { RelayVersion } from '../../relay/relay.version';
import { BeesEntity } from '../../common/bees-entity';

/**
 * @monaco
 */
export interface IAccountV2Service {
  ingest(
    account: AccountV2Payload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;
}

@Injectable({ providedIn: 'root' })
export class AccountV2Service implements IAccountV2Service {
  constructor(private relayService: RelayService) {}

  public async ingest(
    account: AccountV2Payload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<any>(
        BeesEntity.ACCOUNTS,
        RequestMethod.POST,
        RelayVersion.V2,
        [],
        JSON.stringify([account]),
        env?.id,
      ),
    ).execute();
  }
}
