import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../shared/util/sort.query';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { BetweenQuery } from '../../shared/util/between-query';

export interface RequestHistoryQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  env?: number;
  templateId?: number;
  entity?: BeesEntity;
  method?: RequestMethod;
  requestTraceId?: string;
  endpoint?: string;
  dataIngestionVersion?: string; // TODO: Replace with enum
  dateTime?: BetweenQuery<Date>;
  responseStatus?: number;
}

export class RequestHistoryQueryImpl implements RequestHistoryQuery {
  page: LocalPageRequest = new LocalPageRequestImpl();
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.DESC,
  };
  dateTime = {};
}
