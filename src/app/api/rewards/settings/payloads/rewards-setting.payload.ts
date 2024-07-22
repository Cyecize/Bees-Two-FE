import { RewardsSettingCalculationType } from '../enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from '../enums/rewards-setting-earn-type';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RewardsSettingPayload {}

export interface RewardsSettingDefaultConfigurationPayload
  extends RewardsSettingPayload {
  initialBalance: number;
  redeemLimit: number;
  earnLimit: number;
  calculationType: RewardsSettingCalculationType;
  freeGoodEnabled: boolean;
  earnType: RewardsSettingEarnType;
  pricePerPoint: number;
  pricePerPointEnabled: boolean;
}

export interface ImageAndIcon {
  image: string;
  icon: string;
}

export interface HubHeaderContainer {
  web: ImageAndIcon;
  android: ImageAndIcon;
  ios: ImageAndIcon;
}

export interface RewardsSettingHubHeaderPayload extends RewardsSettingPayload {
  hubHeader: HubHeaderContainer;
}

export interface RewardsSettingBenefitsBannerPayload
  extends RewardsSettingPayload {
  //TODO: Define this
  benefitsBanner: any;
}

export interface ImageAndLink {
  imageUrl: string;
  linkUrl: string;
}

export interface BeesBankContainer {
  web: ImageAndLink;
  android: ImageAndLink;
  ios: ImageAndLink;
}

export interface RewardsSettingBeesBankPayload extends RewardsSettingPayload {
  beesBank: BeesBankContainer;
}
