import { SortDirection, SortQuery } from '../../../shared/util/sort.query';
import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../../shared/util/page-request';

export interface LocalAccountQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  env: number;
  name?: string;
  id?: string;
}

export class LocalAccountQueryImpl implements LocalAccountQuery {
  env!: number;
  id = '';
  name = '';
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.ASC,
  };
}
