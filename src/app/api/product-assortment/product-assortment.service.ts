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
import { ProductAssortmentQuery, ProductAssortmentQueryImpl } from "./product-assortment.query";
import { ProductAssortmentItem, ProductAssortmentResponse } from "./product-assortment.response";
import { PlatformIdService } from "../platformid/platform-id.service";

/**
 * @monaco
 */
export interface IProductAssortmentService {
  addAssortmentInclusion(
    payload: InclusionPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesResponse<any>>>;

  searchAssortment(query: ProductAssortmentQuery, env?: CountryEnvironmentModel)
    : Promise<WrappedResponse<ProductAssortmentResponse>>;

  getAssortmentForItems(ddc: string, vendorId: string, vendorItemIds: string[], env?: CountryEnvironmentModel)
    : Promise<ProductAssortmentItem[]>;

  newQuery(): ProductAssortmentQuery;
}

@Injectable({ providedIn: 'root' })
export class ProductAssortmentService implements IProductAssortmentService {
  constructor(
    private repository: ProductAssortmentRepository,
    private relayService: RelayService,
    private platformIdService: PlatformIdService,
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

  public async searchAssortment(
    query: ProductAssortmentQuery,
    env?: CountryEnvironmentModel): Promise<WrappedResponse<ProductAssortmentResponse>> {

    return await new FieldErrorWrapper(() => this.repository.searchAssortments(query, env?.id)).execute();
  }

  public async getAssortmentForItems(
    ddc: string,
    vendorId: string,
    vendorItemIds: string[], env?: CountryEnvironmentModel): Promise<ProductAssortmentItem[]> {
    if (!vendorItemIds.length) {
      throw new Error('vendorItemId is required');
    }
    const query = this.newQuery();
    query.vendorItemIds.push(...vendorItemIds);
    query.page.pageSize = vendorItemIds.length + 1;

    const platformId = await this.platformIdService.encodeDeliveryCenterId({
      vendorId: vendorId,
      vendorDeliveryCenterId: ddc,
    })
    query.deliveryCenterPlatformIds.push(platformId.platformId);

    const resp = await this.searchAssortment(query, env);
    if (!resp.isSuccess) {
      console.error(resp);
      throw new Error('Error while fetching data!');
    }

    return resp.response.response.items;
  }

  newQuery(): ProductAssortmentQuery {
    return new ProductAssortmentQueryImpl();
  }
}
