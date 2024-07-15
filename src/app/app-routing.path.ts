import { RouteConfig } from './shared/routing/route-config';

export class AppRoutingPath {
  public static readonly NOT_FOUND = new RouteConfig('not-found', null);
  public static readonly HOME = new RouteConfig('', null);
  public static readonly PROMOS = new RouteConfig('promos', null);
  public static readonly SEARCH_PROMOS = new RouteConfig('search', AppRoutingPath.PROMOS);
  public static readonly CREATE_PROMO = new RouteConfig('create', AppRoutingPath.PROMOS);
  public static readonly SEARCH_DEALS = new RouteConfig('search-deals', AppRoutingPath.PROMOS);
  public static readonly CREATE_DEAL = new RouteConfig('create-deal', AppRoutingPath.PROMOS);

}
