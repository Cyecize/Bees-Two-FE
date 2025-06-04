import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../../shared/util/page-request';
import { SortDirection, SortQuery } from '../../../shared/util/sort.query';
import { Env } from '../env';
import { BeesEntity } from '../../common/bees-entity';

/**
 * @monaco
 */
export interface SharedClientQuery {
  page: LocalPageRequest;
  sort: SortQuery;
  name: string | null;
  env: Env | null;
  countryCode: string | null;
  vendorId: string | null;
  targetEntities: BeesEntity[];
  environmentIds: number[];
}

export class SharedClientQueryImpl implements SharedClientQuery {
  page: LocalPageRequest = new LocalPageRequestImpl(0, 5);
  sort: SortQuery = {
    field: 'id',
    direction: SortDirection.DESC,
  };
  name: string | null = null;
  env: Env | null = null;
  countryCode: string | null = null;
  vendorId: string | null = null;
  targetEntities: BeesEntity[] = [];
  environmentIds: number[] = [];
}
