import { BeesParam, BeesParamImpl } from '../common/bees-param';
import { CategoryGroupType } from './category-group.type';

/**
 * @monaco
 */
export interface CategoryV3Query {
  ids: string[];
  storeId?: string;
  includeDisabled?: boolean;
  includeTranslations?: boolean;
  restricted: string[];
  vendorIds: string[];
  groups: CategoryGroupType[];

  toBeesQueryParams(): BeesParam[];

  toBeesHeaderParams(): BeesParam[];
}

export class CategoryV3QueryImpl implements CategoryV3Query {
  ids: string[] = [];
  storeId?: string;
  includeDisabled?: boolean;
  includeTranslations?: boolean = true;
  restricted: string[] = [];
  vendorIds: string[] = [];
  groups: CategoryGroupType[] = [];

  toBeesQueryParams(): BeesParam[] {
    const result: BeesParam[] = [];

    // Adds all non null string fields
    Object.keys(this)
      .filter((fieldName) => fieldName !== 'storeId')
      .forEach((fieldName) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const val = this[fieldName];

        if (
          (typeof val === 'string' && val.trim()) ||
          typeof val === 'boolean'
        ) {
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

  toBeesHeaderParams(): BeesParam[] {
    if (!this.storeId?.trim()) {
      return [];
    }

    return [new BeesParamImpl('storeId', this.storeId)];
  }
}
