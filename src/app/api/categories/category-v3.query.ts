import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../proxy/bees-param.payload';

export interface CategoryV3Query {
  ids: string[];
  storeId?: string;
  includeDisabled?: boolean;
  includeTranslations?: boolean;
  restricted: string[];
  vendorIds: string[];
  groups: string[];

  toBeesQueryParams(): BeesParamPayload[];

  toBeesHeaderParams(): BeesParamPayload[];
}

export class CategoryV3QueryImpl implements CategoryV3Query {
  ids: string[] = [];
  storeId?: string;
  includeDisabled?: boolean;
  includeTranslations?: boolean = true;
  restricted: string[] = [];
  vendorIds: string[] = [];
  groups: string[] = [];

  toBeesQueryParams(): BeesParamPayload[] {
    const result: BeesParamPayload[] = [];

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
          result.push(new BeesParamPayloadImpl(fieldName, this[fieldName]));
        }

        if (Array.isArray(val) && val.length > 0) {
          result.push(new BeesParamPayloadImpl(fieldName, val.join(',')));
        }
      });

    return result;
  }

  toBeesHeaderParams(): BeesParamPayload[] {
    if (!this.storeId?.trim()) {
      return [];
    }

    return [new BeesParamPayloadImpl('storeId', this.storeId)];
  }
}
