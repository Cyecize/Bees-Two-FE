import { RouteConfig } from './shared/routing/route-config';

export class AppRoutingPath {
  public static readonly NOT_FOUND = new RouteConfig('not-found', null);
  public static readonly HOME = new RouteConfig('', null);
  public static readonly LOGIN = new RouteConfig('login', null);
  public static readonly PROMOS = new RouteConfig('promos', null);
  public static readonly SEARCH_PROMOS_V3 = new RouteConfig('search-promos-v3', AppRoutingPath.PROMOS);
  public static readonly CREATE_PROMO = new RouteConfig('create-promos-v3', AppRoutingPath.PROMOS);
  public static readonly SEARCH_DEALS = new RouteConfig('search-deals', AppRoutingPath.PROMOS);
  public static readonly CREATE_DEAL = new RouteConfig('create-deal', AppRoutingPath.PROMOS);
  public static readonly EDIT_DEAL = new RouteConfig('deals/:idType/:idValue/:vendorDealId/env/:envId/edit', AppRoutingPath.PROMOS);
  public static readonly REWARDS = new RouteConfig('rewards', null);
  public static readonly REWARDS_SETTINGS = new RouteConfig('settings', AppRoutingPath.REWARDS);
  public static readonly SEARCH_REWARDS_SETTINGS = new RouteConfig('search', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly CREATE_REWARDS_SETTINGS = new RouteConfig('create', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly CREATE_REWARDS_SETTINGS_RAW = new RouteConfig('create-raw', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly EDIT_REWARDS_SETTINGS = new RouteConfig(':level/:id/:tier/:type/env/:envId/edit', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly EDIT_REWARDS_SETTINGS_RAW = new RouteConfig(':level/:id/:tier/:type/env/:envId/edit-raw', AppRoutingPath.REWARDS_SETTINGS);
  public static readonly REWARDS_SEGMENTATION = new RouteConfig('segmentation', AppRoutingPath.REWARDS);
  public static readonly SEARCH_SEGMENTATION_GROUPS = new RouteConfig('search-groups', AppRoutingPath.REWARDS_SEGMENTATION);
  public static readonly SEARCH_SEGMENTATION_GROUPS_BY_ACCOUNT = new RouteConfig('search-groups-by-account', AppRoutingPath.REWARDS_SEGMENTATION);
  public static readonly CREATE_SEGMENTATION_GROUP = new RouteConfig('create-group', AppRoutingPath.REWARDS_SEGMENTATION);
  public static readonly REWARDS_CHALLENGES = new RouteConfig('challenges', AppRoutingPath.REWARDS);
  public static readonly SEARCH_CHALLENGES = new RouteConfig('search', AppRoutingPath.REWARDS_CHALLENGES);
  public static readonly CREATE_CHALLENGE = new RouteConfig('create', AppRoutingPath.REWARDS_CHALLENGES);
  public static readonly ACCOUNTS = new RouteConfig('accounts', null);
  public static readonly ACCOUNTS_SEARCH_V1 = new RouteConfig('search-v1', AppRoutingPath.ACCOUNTS);
  public static readonly ACCOUNTS_ADD_V2_RAW = new RouteConfig('add-v2-raw', AppRoutingPath.ACCOUNTS);
  public static readonly DELIVERY_WINDOWS_ADD = new RouteConfig('delivery-windows/add', AppRoutingPath.ACCOUNTS);
  public static readonly DELIVERY_WINDOWS_SEARCH = new RouteConfig('delivery-windows/search', AppRoutingPath.ACCOUNTS);
  public static readonly ITEMS = new RouteConfig('items', null);
  public static readonly ITEMS_SEARCH = new RouteConfig('search', AppRoutingPath.ITEMS);
  public static readonly ITEMS_ADD_RAW = new RouteConfig('add-raw', AppRoutingPath.ITEMS);
  public static readonly ASSORTMENT = new RouteConfig('assortment', null);
  public static readonly ASSORTMENT_INCLUSION_V4 = new RouteConfig('inclusion-v4', AppRoutingPath.ASSORTMENT);
  public static readonly ASSORTMENT_UNAVAILABLE_V3 = new RouteConfig('unavailable-v4', AppRoutingPath.ASSORTMENT);
  public static readonly ASSORTMENT_SEARCH_BY_DDC_V2 = new RouteConfig('search-ddc-v2', AppRoutingPath.ASSORTMENT);
}
