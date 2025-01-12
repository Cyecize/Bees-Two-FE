import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { CategoryV3Query } from './category-v3.query';
import { CategoryV3 } from './category-v3';
import { RouteUtils } from '../../shared/routing/route-utils';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
  constructor(private proxyService: ProxyService) {}

  public searchCategoriesV3(
    query: CategoryV3Query,
    envId?: number,
  ): Observable<BeesResponse<CategoryV3[]>> {
    return this.proxyService.makeRequest<CategoryV3[]>({
      endpoint: Endpoints.CATEGORIES_V3,
      entity: BeesEntity.CATEGORIES,
      method: RequestMethod.GET,
      targetEnv: envId,
      queryParams: query.toBeesQueryParams(),
      headers: query.toBeesHeaderParams(),
    });
  }

  public patchCategoryV3(
    categoryId: string,
    body: any,
    envId?: number,
  ): Observable<BeesResponse<CategoryV3[]>> {
    return this.proxyService.makeRequest<CategoryV3[]>({
      endpoint: RouteUtils.setPathParams(Endpoints.CATEGORY_V3, [categoryId]),
      entity: BeesEntity.CATEGORIES,
      method: RequestMethod.PATCH,
      targetEnv: envId,
      data: body,
    });
  }
}
