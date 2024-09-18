import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../shared/util/sort.query';
import { Env } from './env';

export interface CountryEnvironmentQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  envName?: string;
  env?: Env;
  countryCode?: string;
  vendorId?: string;
  storeId?: string;
}

export class CountryEnvironmentQueryImpl implements CountryEnvironmentQuery {
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'countryCode',
    direction: SortDirection.ASC,
  };
  envName?: string;
  env?: Env;
  countryCode?: string;
  vendorId?: string;
  storeId?: string;
}
