import { PageRequest } from './page-request';

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageable: PageRequest;
}

export class EmptyPage<T> implements Page<T> {
  content: T[] = [];
  totalElements = 0;
  pageable: PageRequest = { pageNumber: 0, pageSize: 10 };
  totalPages = 0;
}

export class PageImpl<T> implements Page<T> {
  constructor(
    public content: T[],
    private totalItems?: number,
    private _totalPages?: number,
    private pageInfo?: PageRequest,
  ) {}

  get totalElements(): number {
    return this.totalItems || this.content.length;
  }

  get pageable(): PageRequest {
    return this.pageInfo || { pageNumber: 0, pageSize: this.content.length };
  }

  get totalPages(): number {
    return this._totalPages || 1;
  }
}
