import { DEFAULT_PAGE_SIZE } from '../general.constants';
import {
  BeesParamPayload,
  BeesParamPayloadImpl,
} from '../../api/proxy/bees-param.payload';

export interface PageRequest {
  page: number;
  pageSize: number;
  toBeesParams(): BeesParamPayload[];
}

export class PageRequestImpl implements PageRequest {
  page = 0;
  pageSize: number;

  constructor(page = 0, pageSize: number = DEFAULT_PAGE_SIZE) {
    this.page = page;
    this.pageSize = pageSize;
  }

  toBeesParams(): BeesParamPayload[] {
    return [
      new BeesParamPayloadImpl('page', this.page),
      new BeesParamPayloadImpl('pageSize', this.pageSize),
    ];
  }
}

export class PageRequestImplV2 extends PageRequestImpl {
  override toBeesParams(): BeesParamPayload[] {
    return [
      new BeesParamPayloadImpl('page', this.page),
      new BeesParamPayloadImpl('size', this.pageSize),
    ];
  }
}

export class PageRequestImplV3 extends PageRequestImpl {
  override toBeesParams(): BeesParamPayload[] {
    return [
      new BeesParamPayloadImpl('page', this.page),
      new BeesParamPayloadImpl('limit', this.pageSize),
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
