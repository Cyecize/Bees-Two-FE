import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../shared/util/sort.query';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';

export interface RequestTemplateQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  name?: string;
  entity?: BeesEntity;
  method?: RequestMethod;
}

export class RequestTemplateQueryImpl implements RequestTemplateQuery {
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.DESC,
  };
  name = '';
  entity = undefined;
  method = undefined;
}
