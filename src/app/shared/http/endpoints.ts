export class Endpoints {
  public static readonly LOGIN = '/login';
  public static readonly USER_DETAILS = '/user-details';
  public static readonly ENVIRONMENTS = '/environments';
  public static readonly ENVIRONMENT = '/environments/:id';
  public static readonly ENVIRONMENT_TOKEN = '/environments/:id/token';
  public static readonly ENVIRONMENTS_SEARCH = '/environments/search';
  public static readonly ENVIRONMENTS_COUNTRY_CODES = '/environments/country-codes';
  public static readonly REQUEST = '/request';
  public static readonly REQUEST_MULTILANGUAGE = '/request-multilanguage';
  public static readonly PLATFORM_ID_ENCODE_CONTRACT = '/platform-id/encode/contract';
  public static readonly PLATFORM_ID_ENCODE_DELIVERY_CENTER = '/platform-id/encode/delivery-center';
  public static readonly PLATFORM_ID_ENCODE_INVENTORY = '/platform-id/encode/inventory';
  public static readonly PLATFORM_ID_DECODE_CONTRACT = '/platform-id/decode/contract/:id';
  public static readonly ACCOUNTS_SEARCH = '/accounts/search';
  public static readonly ACCOUNTS = '/accounts';
  public static readonly ACCOUNT = '/accounts/:id';

  // Bees endpoints
  public static readonly DATA_INGESTION = '/api/v1/data-ingestion-relay-service/v1';
  public static readonly BEES_REWARDS_SETTINGS_V1 = '/api/rewards-service/v1/settings';
  public static readonly BEES_REWARDS_SETTING_V1 = '/api/rewards-service/v1/settings/:settingId/:type/:level/:tier';
  public static readonly BEES_REWARDS_CHALLENGES_V2 = '/api/rewards-service/v2/challenges';
  public static readonly BEES_REWARDS_CHALLENGE_V1 = '/api/v1/rewards-service/challenges/:id';
  public static readonly BEES_SEGMENTATION_GROUPS = '/segmentation-service/v1/groups';
  public static readonly BEES_SEGMENTATION_GROUP = '/segmentation-service/v1/groups/:id';
  public static readonly BEES_SEGMENTATION_ACCOUNT_GROUPS = '/segmentation-service/v1/account-groups';
  public static readonly BEES_SEGMENTATION_ACCOUNT_GROUP = '/segmentation-service/v1/account-groups/:id';
  public static readonly BEES_SEGMENTATION_ACCOUNT_GROUP_GROUP = '/segmentation-service/v1/account-groups/:accId/groups/:groupId';
  public static readonly PROMOTIONS_V3 = '/v1/promotion-service/v3/promotions';
  public static readonly DEAL_SERVICE_V3 = '/deal-service/v3';
  public static readonly DEAL_RELAY_V3 = '/deal-relay/v3';
  public static readonly ACCOUNT_V1 = '/v1/accounts/';
  public static readonly DELIVERY_WINDOWS_V1 = '/v1/account-relay/delivery-windows';
  public static readonly ITEMS_V2 = '/api/items/items/v2';
  public static readonly ITEMS_V2_RELAY = '/api/item-relay/v2/items';
  public static readonly PRODUCT_ASSORTMENT_INCLUSION_V4 = '/api/product-assortment-relay/v4/delivery-centers/assortments';
  public static readonly FILES_UPLOAD = '/api/v1/files/upload';
  public static readonly CMS_FILES_UPLOAD = '/api/v1';
  public static readonly ORDER_SERVICE_ORDERS_V3 = '/v1/order-service/v3/orders';
  public static readonly CATEGORIES_V3 = '/api/categories/v3';
  public static readonly CATEGORY_V3 = '/api/categories/v3/:id';
}
