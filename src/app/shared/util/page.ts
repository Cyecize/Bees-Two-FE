import { LocalPageRequest, LocalPageRequestImpl } from './page-request';

export interface Pagination {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export class EmptyPagination implements Pagination {
  page = 0;
  pageSize = 1;
  totalElements = 0;
  totalPages = 1;
}

export interface PaginationV2 {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPage: number;
}

export class EmptyPaginationV2 implements PaginationV2 {
  page = 0;
  pageSize = 1;
  totalElements = 0;
  totalPage = 1;
}

export function v2ToV1Pagination(v2Page: PaginationV2): Pagination {
  const page = new EmptyPagination();
  page.totalElements = v2Page.totalElements;
  page.totalPages = v2Page.totalPage;
  page.page = v2Page.page;
  page.pageSize = v2Page.pageSize;

  return page;
}

export interface HasNextPagination {
  hasNext: boolean;
  page: number;
}

export class EmptyHasNextPagination implements HasNextPagination {
  hasNext = false;
  page = 0;
}

export interface HasMorePagination {
  hasMore: boolean;
  page: number;
}

export class EmptyHasMorePagination implements HasMorePagination {
  hasMore = false;
  page = 0;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageable: LocalPageRequest;
}

export class EmptyPage<T> implements Page<T> {
  content: T[] = [];
  totalElements = 0;
  pageable: LocalPageRequest = new LocalPageRequestImpl(0, 10);
  totalPages = 0;
}

export class PageImpl<T> implements Page<T> {
  constructor(
    public content: T[],
    private totalItems?: number,
    private _totalPages?: number,
    private pageInfo?: LocalPageRequest,
  ) {}

  get totalElements(): number {
    return this.totalItems || this.content.length;
  }

  get pageable(): LocalPageRequest {
    return this.pageInfo || new LocalPageRequestImpl(0, this.content.length);
  }

  get totalPages(): number {
    return this._totalPages || 1;
  }
}

export function pageToPagination(page: Page<any>): Pagination {
  return {
    page: page.pageable.pageNumber,
    pageSize: page.pageable.pageSize,
    totalPages: page.totalPages,
    totalElements: page.totalElements,
  };
}
