import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../../../shared/util/sort.query';

export interface RequestTemplatePresetQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  name: string | null;
  templateId: number | null;
}

export class RequestTemplatePresetQueryImpl
  implements RequestTemplatePresetQuery
{
  page: LocalPageRequest = new LocalPageRequestImpl(0, 2);
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.DESC,
  };
  name = null;
  templateId = null;
}
