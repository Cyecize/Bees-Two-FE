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
import {
  InventoriesResponse,
  InventoryResponse,
} from './dto/inventories.response';
import { InventoryRepository } from './inventory.repository';
import { Inventory } from './dto/inventory';
import { AccountV1Service } from '../accounts/v1/account-v1.service';
import { PlatformIdService } from '../platformid/platform-id.service';

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

  getStockForItem(
    vendorItemId: string,
    vendorAccountId: string,
    env: CountryEnvironmentModel,
  ): Promise<InventoryResponse | null>;
}

@Injectable({ providedIn: 'root' })
export class InventoryService implements IInventoryService {
  constructor(
    private relayService: RelayService,
    private repository: InventoryRepository,
    private accountV1Service: AccountV1Service,
    private platformIdService: PlatformIdService,
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

  async getStockForItem(
    vendorItemId: string,
    vendorAccountId: string,
    env: CountryEnvironmentModel,
  ): Promise<InventoryResponse | null> {
    const query = this.newQuery();
    const account = await this.accountV1Service.findOne(env, vendorAccountId);

    if (!account) {
      console.warn(`Invalid account ${vendorAccountId}}!`);
      return null;
    }

    const platformId = await this.platformIdService.encodeInventoryId({
      vendorAccountId: vendorAccountId,
      vendorItemId: vendorItemId,
      vendorId: env.vendorId,
      vendorDeliveryCenterId: account.deliveryCenterId!,
    });

    query.inventoryPlatformIds.push(platformId.platformId);

    const response = await this.searchStock(query, env);

    if (response.isSuccess) {
      const inventories = response.response.response.inventories;
      if (inventories.length > 0) {
        return inventories[0];
      }

      return null;
    }

    console.error(response);
    return null;
  }
}
