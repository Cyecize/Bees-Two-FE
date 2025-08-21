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
import { InventoryQuery, InventoryQueryImpl } from './dto/inventory.query';
import { InventoriesResponse } from './dto/inventories.response';
import { InventoryRepository } from './inventory.repository';

/**
 * @monaco
 */
export interface IInventoryService {
  addStock(
    inventoryPayload: InventoryPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;

  newQuery(): InventoryQuery;

  searchStock(
    query: InventoryQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<InventoriesResponse>>;
}

@Injectable({ providedIn: 'root' })
export class InventoryService implements IInventoryService {
  constructor(
    private relayService: RelayService,
    private repository: InventoryRepository,
  ) {}

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

  newQuery(): InventoryQuery {
    return new InventoryQueryImpl();
  }

  async searchStock(
    query: InventoryQuery,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<InventoriesResponse>> {
    return await new FieldErrorWrapper(() =>
      this.repository.searchStock(query, env?.id),
    ).execute();
  }
}
