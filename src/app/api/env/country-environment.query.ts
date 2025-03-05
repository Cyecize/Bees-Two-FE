import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../shared/util/sort.query';
import { Env } from './env';

export interface CountryEnvironmentQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  envName: string | null;
  env: Env | null;
  countryCode: string | null;
  vendorId: string | null;
  storeId: string | null;
}

export class CountryEnvironmentQueryImpl implements CountryEnvironmentQuery {
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'countryCode',
    direction: SortDirection.ASC,
  };
  envName: string | null = null;
  env: Env | null = null;
  countryCode: string | null = null;
  vendorId: string | null = null;
  storeId: string | null = null;
}
