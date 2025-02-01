import { DEFAULT_PAGE_SIZE } from '../general.constants';
import { BeesParam, BeesParamImpl } from '../../api/common/bees-param';

export interface PageRequest {
  page: number;
  pageSize: number;
  toBeesParams(): BeesParam[];
}

export class PageRequestImpl implements PageRequest {
  page = 0;
  pageSize: number;

  constructor(page = 0, pageSize: number = DEFAULT_PAGE_SIZE) {
    this.page = page;
    this.pageSize = pageSize;
  }

  toBeesParams(): BeesParam[] {
    return [
      new BeesParamImpl('page', this.page),
      new BeesParamImpl('pageSize', this.pageSize),
    ];
  }
}

export class PageRequestImplV2 extends PageRequestImpl {
  override toBeesParams(): BeesParam[] {
    return [
      new BeesParamImpl('page', this.page),
      new BeesParamImpl('size', this.pageSize),
    ];
  }
}

export class PageRequestImplV3 extends PageRequestImpl {
  override toBeesParams(): BeesParam[] {
    return [
      new BeesParamImpl('page', this.page),
      new BeesParamImpl('limit', this.pageSize),
    ];
  }
}

export interface LocalPageRequest {
  pageNumber: number;
  pageSize: number;
}

export class LocalPageRequestImpl implements LocalPageRequest {
  pageNumber = 0;
  pageSize: number = DEFAULT_PAGE_SIZE;

  constructor(page?: number, size?: number) {
    if (page) {
      this.pageNumber = page;
    }

    if (size) {
      this.pageSize = size;
    }
  }
}
