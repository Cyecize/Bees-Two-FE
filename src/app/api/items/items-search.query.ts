import { PageRequest, PageRequestImpl } from '../../shared/util/page-request';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../proxy/bees-param.payload';

export interface ItemsSearchQuery {
  skus: string[];
  vendorItemIds: string[];
  ids: string[];
  itemPlatformIds: string[];
  agingGroups: string[];
  includeDeleted?: boolean;
  includeDisabled?: boolean;
  includeAlcoholic?: boolean;
  includeNarcotic?: boolean;
  includeHidden?: boolean;
  manufacturerId?: string;
  page: PageRequest;
  vendorId?: string;

  toBeesQueryParams(): BeesParamPayload[];
}

export class ItemSearchQueryImpl implements ItemsSearchQuery {
  agingGroups: string[] = [];
  ids: string[] = [];
  includeAlcoholic?: boolean;
  includeDeleted?: boolean;
  includeDisabled?: boolean;
  includeHidden?: boolean;
  includeNarcotic?: boolean;
  itemPlatformIds: string[] = [];
  manufacturerId?: string;
  page: PageRequest = new PageRequestImpl(0, 50);
  skus: string[] = [];
  vendorId?: string;
  vendorItemIds: string[] = [];

  toBeesQueryParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // @ts-ignore
      const val = this[fieldName];

      if ((typeof val === 'string' && val.trim()) || typeof val === 'boolean') {
        // @ts-ignore
        result.push(new BeesParamPayloadImpl(fieldName, this[fieldName]));
      }

      if (Array.isArray(val) && val.length > 0) {
        result.push(new BeesParamPayloadImpl(fieldName, val.join(',')));
      }
    });

    return result;
  }
}
