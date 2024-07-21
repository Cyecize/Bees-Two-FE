import { RouteConfig } from './shared/routing/route-config';

export class AppRoutingPath {
  public static readonly NOT_FOUND = new RouteConfig('not-found', null);
  public static readonly HOME = new RouteConfig('', null);
  public static readonly PROMOS = new RouteConfig('promos', null);
  public static readonly SEARCH_PROMOS_V3 = new RouteConfig('search-promos-v3', AppRoutingPath.PROMOS);
  public static readonly CREATE_PROMO = new RouteConfig('create-promos-v3', AppRoutingPath.PROMOS);
  public static readonly SEARCH_DEALS = new RouteConfig('search-deals', AppRoutingPath.PROMOS);
  public static readonly CREATE_DEAL = new RouteConfig('create-deal', AppRoutingPath.PROMOS);
  public static readonly REWARDS = new RouteConfig('rewards', null);
  public static readonly REWARDS_SETTINGS = new RouteConfig('settings', AppRoutingPath.REWARDS);
  public static readonly SEARCH_REWARDS_SETTINGS = new RouteConfig('search', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly CREATE_REWARDS_SETTINGS = new RouteConfig('create', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly EDIT_REWARDS_SETTINGS = new RouteConfig(':id/type/:type/tier/:tier/level/:level/env/:envId/edit', AppRoutingPath.REWARDS_SETTINGS);

}
