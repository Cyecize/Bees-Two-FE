import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from '../relay/relay.version';
import { RelayService } from '../relay/relay.service';
import { InventoryPayload } from './dto/inventory.payload';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private relayService: RelayService) {}

  public async addStock(
    inventoryPayload: InventoryPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return new FieldErrorWrapper(() =>
      this.relayService.send<any>(
        BeesEntity.INVENTORY,
        RequestMethod.POST,
        RelayVersion.V3,
        [],
        JSON.stringify(inventoryPayload),
        env?.id,
      ),
    ).execute();
  }
}
