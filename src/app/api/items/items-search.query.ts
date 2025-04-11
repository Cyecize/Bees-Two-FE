import { PageRequest, PageRequestImpl } from '../../shared/util/page-request';
import { BeesParam, BeesParamImpl } from '../common/bees-param';

/**
 * @monaco
 */
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

  toBeesQueryParams(): BeesParam[];
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

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    result.push(...this.page.toBeesParams());

    // Adds all non null string fields
    Object.keys(this).forEach((fieldName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const val = this[fieldName];

      if ((typeof val === 'string' && val.trim()) || typeof val === 'boolean') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.push(new BeesParamImpl(fieldName, this[fieldName]));
      }

      if (Array.isArray(val) && val.length > 0) {
        result.push(new BeesParamImpl(fieldName, val.join(',')));
      }
    });

    return result;
  }
}
