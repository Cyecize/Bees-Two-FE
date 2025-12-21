import { PageRequest, PageRequestImpl } from "../../shared/util/page-request";
import { ProductAssortmentDeliveryMethod } from "./product-assortment-delivery-method";
import { BeesParam } from "../common/bees-param";
import { BeesQueryParamsHelper } from "../../shared/util/bees-query-params.helper";

/**
 * @monaco
 */
export interface ProductAssortmentQuery {
  page: PageRequest;
  deliveryCenterPlatformIds: string[];
  vendorItemIds: string[];
  deliveryMethods: ProductAssortmentDeliveryMethod[];

  toBeesQueryParams(): BeesParam[];
}

export class ProductAssortmentQueryImpl implements ProductAssortmentQuery {
  page = new PageRequestImpl();
  deliveryCenterPlatformIds: string[] = [];
  vendorItemIds: string[] = [];
  deliveryMethods: ProductAssortmentDeliveryMethod[] = [];

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    return BeesQueryParamsHelper.toBeesParams(this, result);
  }
}
