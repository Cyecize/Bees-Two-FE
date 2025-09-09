import { ErrorResponse } from '../proxy/error-response';
import { BeesResponse } from '../proxy/bees-response';
import { firstValueFrom, Observable } from 'rxjs';
import {
  DialogService,
  IDialogService,
} from '../../shared/dialog/dialog.service';
import { IVendorV2Service, VendorV2Service } from '../vendor/vendor-v2.service';
import {
  IPlatformIdService,
  PlatformIdService,
} from '../platformid/platform-id.service';
import { DealsService, IDealsService } from '../deals/deals.service';
import { IPromoService, PromoService } from '../promo/promo.service';
import {
  ISharedClientService,
  SharedClientService,
} from '../env/sharedclient/shared-client.service';
import { IItemService, ItemService } from '../items/item.service';
import { GrowService, IGrowService } from '../grow/grow.service';
import { IOrderService, OrderService } from '../orders/order.service';
import {
  CountryEnvironmentService,
  ICountryEnvironmentService,
} from '../env/country-environment.service';
import {
  ILocalAccountService,
  LocalAccountService,
} from '../accounts/local/local-account.service';
import {
  AccountV1Service,
  IAccountV1Service,
} from '../accounts/v1/account-v1.service';
import {
  BeesContractService,
  IBeesContractService,
} from '../accounts/contracts/bees-contract.service';
import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Env } from '../env/env';
import { BeesEntity } from '../common/bees-entity';
import { PromoType } from '../promo/promo-type';
import { DealOutputType } from '../deals/enums/deal-output-type';
import { DealAccumulationType } from '../deals/enums/deal-accumulation-type';
import { DealDiscountType } from '../deals/enums/deal-discount-type';
import { DealComboType } from '../deals/enums/deal-combo-type';
import { DealType } from '../deals/enums/deal-type';
import { DealIdType } from '../deals/enums/deal-id-type';
import { PlatformIdType } from '../platformid/platform-id.type';
import { SortDirection } from '../../shared/util/sort.query';
import { RewardsSettingCalculationType } from '../rewards/settings/enums/rewards-setting-calculation-type';
import { RewardsSettingEarnType } from '../rewards/settings/enums/rewards-setting-earn-type';
import { RewardsSettingLevel } from '../rewards/settings/enums/rewards-setting-level';
import { RewardsSettingType } from '../rewards/settings/enums/rewards-setting-type';
import {
  IRewardsSettingsService,
  RewardsSettingsService,
} from '../rewards/settings/rewards-settings.service';
import { RewardsTierLevel } from '../rewards/rewards-tier-level';
import { ChallengeSort } from '../rewards/challenges/challenge.sort';
import { ChallengeExecutionMethod } from '../rewards/challenges/challenge-execution-method';
import { ChallengeFilterType } from '../rewards/challenges/challenge-filter-type';
import { ChallengeMode } from '../rewards/challenges/challenge-mode';
import { ChallengePaginationModel } from '../rewards/challenges/challenge-pagination-model';
import { ChallengeType } from '../rewards/challenges/challenge-type';
import {
  ChallengeService,
  IChallengeService,
} from '../rewards/challenges/challenge.service';
import {
  ISegmentationService,
  SegmentationService,
} from '../rewards/segmentation/segmentation.service';
import {
  DeliveryWindowService,
  IDeliveryWindowService,
} from '../accounts/delivery-window/delivery-window.service';
import { IPriceService, PriceService } from '../price/price.service';
import { DealConditionAmountScope } from '../deals/enums/deal-condition-amount-scope';
import { DealConditionAmountOperator } from '../deals/enums/deal-condition-amount-operator';
import { DealConditionAmountField } from '../deals/enums/deal-condition-amount-field';
import { DealRangeTriggerType } from '../deals/enums/deal-range-trigger-type';
import { DealManualDiscountApplyTo } from '../deals/enums/deal-manual-discount-apply-to';
import { DealChargeType } from '../deals/enums/deal-charge-type';
import { DeliveryDateDirection } from '../inventory/enums/delivery-date-direction';
import { InventoryItemType } from '../inventory/enums/inventory-item-type';
import {
  IInventoryService,
  InventoryService,
} from '../inventory/inventory.service';
import {
  AccountV2Service,
  IAccountV2Service,
} from '../accounts/v2/account-v2.service';
import { CategoryGroupType } from '../categories/category-group.type';
import {
  CategoryV3Service,
  ICategoryV3Service,
} from '../categories/category-v3.service';
import { RelayVersion } from '../relay/relay.version';
import { RequestMethod } from '../common/request-method';
import { IRelayService, RelayService } from '../relay/relay.service';

/**
 * @monaco
 */
interface WrappedResponse<T> {
  isSuccess: boolean;
  errorResp?: ErrorResponse;
  response: BeesResponse<T>;
}

interface BeesRx {
  /** Observable constructor */
  Observable: typeof Observable;
  /** Convert observable to promise */
  firstValueFrom: typeof firstValueFrom;
}

interface HttpClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get<TResponse>(url: string, options = {}): Observable<TResponse>;
}

/**
 * This is where you can add a service that you'd wish to expose to the playground.
 * @monaco
 * @monaco_include_deps
 */
interface IBees {
  /** RxJS utilities */
  rx: BeesRx;
  dialogService: IDialogService;
  localAccountService: ILocalAccountService;
  accountV1Service: IAccountV1Service;
  accountV2Service: IAccountV2Service;
  beesContractService: IBeesContractService;
  envService: ICountryEnvironmentService;
  orderService: IOrderService;
  http: HttpClient;
  grow: IGrowService;
  vendorService: IVendorV2Service;
  itemService: IItemService;
  sharedClients: ISharedClientService;
  promoService: IPromoService;
  dealsService: IDealsService;
  platformIdService: IPlatformIdService;
  rewardsSettingsService: IRewardsSettingsService;
  challengeService: IChallengeService;
  segmentationService: ISegmentationService;
  deliveryWindowService: IDeliveryWindowService;
  priceService: IPriceService;
  inventoryService: IInventoryService;
  categoryV3Service: ICategoryV3Service;
  relayService: IRelayService;
}

@Injectable({ providedIn: 'root' })
export class Bees implements IBees {
  rx = {
    Observable,
    firstValueFrom,
  };

  constructor(
    public dialogService: DialogService,
    public localAccountService: LocalAccountService,
    public accountV1Service: AccountV1Service,
    public envService: CountryEnvironmentService,
    public http: HttpClientSecuredService,
    public grow: GrowService,
    public beesContractService: BeesContractService,
    public orderService: OrderService,
    public vendorService: VendorV2Service,
    public itemService: ItemService,
    public sharedClients: SharedClientService,
    public promoService: PromoService,
    public dealsService: DealsService,
    public platformIdService: PlatformIdService,
    public rewardsSettingsService: RewardsSettingsService,
    public challengeService: ChallengeService,
    public segmentationService: SegmentationService,
    public deliveryWindowService: DeliveryWindowService,
    public priceService: PriceService,
    public inventoryService: InventoryService,
    public accountV2Service: AccountV2Service,
    public categoryV3Service: CategoryV3Service,
    public relayService: RelayService,
  ) {}
}

/**
 * Add your enum here, so that it is available for use on ROOT level in the payground.
 * eg. bees.someService.someMethod(Env.SIT_GLOBAL)
 */
export const publicEnums = {
  Env: Env,
  BeesEntity: BeesEntity,
  PromoType: PromoType,
  DealOutputType: DealOutputType,
  DealAccumulationType: DealAccumulationType,
  DealDiscountType: DealDiscountType,
  DealComboType: DealComboType,
  DealType: DealType,
  DealIdType: DealIdType,
  PlatformIdType: PlatformIdType,
  SortDirection: SortDirection,
  RewardsSettingCalculationType,
  RewardsSettingEarnType,
  RewardsSettingLevel,
  RewardsSettingType,
  RewardsTierLevel,
  ChallengeSort,
  ChallengeExecutionMethod,
  ChallengeFilterType,
  ChallengeMode,
  ChallengePaginationModel,
  ChallengeType,
  DealConditionAmountScope,
  DealConditionAmountOperator,
  DealConditionAmountField,
  DealRangeTriggerType,
  DealManualDiscountApplyTo,
  DealChargeType,
  DeliveryDateDirection,
  InventoryItemType,
  CategoryGroupType,
  RelayVersion,
  RequestMethod,
};
