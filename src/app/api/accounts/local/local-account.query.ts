import { SortDirection, SortQuery } from '../../../shared/util/sort.query';
import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../../shared/util/page-request';

export interface LocalAccountQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  env: number | null;
  name?: string;
  id?: string;
  beesId?: string;
  vendorAccountId?: string;
  customerAccountId?: string;
}

export class LocalAccountQueryImpl implements LocalAccountQuery {
  env: number | null = null;
  id = '';
  name = '';
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.ASC,
  };
  beesId = '';
  vendorAccountId = '';
  customerAccountId = '';
}
