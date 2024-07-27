export class Endpoints {
  public static readonly ENVIRONMENTS = '/environments';
  public static readonly ENVIRONMENT = '/environments/:id';
  public static readonly REQUEST = '/request';
  public static readonly PLATFORM_ID_ENCODE_CONTRACT = '/platform-id/encode/contract';
  public static readonly PLATFORM_ID_DECODE_CONTRACT = '/platform-id/decode/contract/:id';

  // Bees endpoints
  public static readonly BEES_REWARDS_SETTINGS_V1 = '/api/rewards-service/v1/settings';
  public static readonly BEES_REWARDS_SETTING_V1 = '/api/rewards-service/v1/settings/:settingId/:type/:level/:tier';
  public static readonly PROMOTIONS_V3 = '/v1/promotion-service/v3/promotions';
}
