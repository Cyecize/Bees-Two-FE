import { ChallengeExecutionMethod } from './challenge-execution-method';
import { ChallengePaginationModel } from './challenge-pagination-model';
import {
  PageRequest,
  PageRequestImpl,
} from '../../../shared/util/page-request';
import { ChallengeMode } from './challenge-mode';
import { ChallengeSort } from './challenge.sort';
import { SortDirection } from '../../../shared/util/sort.query';
import { ChallengeFilterType } from './challenge-filter-type';
import { BeesParam, BeesParamImpl } from '../../common/bees-param';
import { ObjectUtils } from '../../../shared/util/object-utils';

export interface ChallengesQuery {
  paginationModel?: ChallengePaginationModel; //TODO: header
  acceptLanguage?: string; //TODO: header
  page: PageRequest;
  executionMethod: ChallengeExecutionMethod[];
  challengeIds: string[];
  modes: ChallengeMode[];
  vendorIds: string[];
  startDate?: string; // ISO
  endDate?: string; // ISO
  challengeSort?: ChallengeSort;
  sortingOrder?: SortDirection;
  regexFilter?: string;
  filterType?: ChallengeFilterType;
  withoutFilters?: boolean;
  groupIds: string[];
  isDtaas?: boolean;

  toBeesQueryParams(): BeesParam[];
}

export class ChallengesQueryImpl implements ChallengesQuery {
  paginationModel?: ChallengePaginationModel;
  acceptLanguage?: string;
  page: PageRequest = new PageRequestImpl(0, 50);
  executionMethod: ChallengeExecutionMethod[] = [];
  challengeIds: string[] = [];
  modes: ChallengeMode[] = [];
  vendorIds: string[] = [];
  startDate?: string;
  endDate?: string;
  challengeSort?: ChallengeSort;
  sortingOrder?: SortDirection;
  regexFilter?: string;
  filterType?: ChallengeFilterType;
  withoutFilters?: boolean;
  groupIds: string[] = [];
  isDtaas?: boolean;

  public toBeesQueryParams(): BeesParam[] {
    const res: BeesParam[] = [];
    res.push(...this.page.toBeesParams());

    if (!ObjectUtils.isNil(this.isDtaas)) {
      res.push(new BeesParamImpl('isDtaas', this.isDtaas));
    }

    if (!ObjectUtils.isNil(this.withoutFilters)) {
      res.push(new BeesParamImpl('withoutFilters', this.withoutFilters));
    }

    Object.keys(this).forEach((fieldName) => {
      // @ts-ignore
      const val = this[fieldName];

      if (typeof val === 'string' && val.trim()) {
        res.push(new BeesParamImpl(fieldName, val));
      }

      if (!ObjectUtils.isNil(val) && val instanceof Array && val.length > 0) {
        res.push(new BeesParamImpl(fieldName, val.join(',')));
      }
    });

    return res;
  }
}
