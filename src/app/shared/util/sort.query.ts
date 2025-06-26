/**
 * @monaco
 */
export interface SortQuery {
  field: string;
  direction: SortDirection;
}

/**
 * @monaco
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
