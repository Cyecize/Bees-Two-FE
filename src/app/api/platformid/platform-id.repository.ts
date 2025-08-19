import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { ContractPlatformId } from './dto/contract-platform-id';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { RouteUtils } from '../../shared/routing/route-utils';
import { EncodedPlatformId } from './dto/encoded-platform-id';
import { DeliveryCenterPlatformId } from './dto/delivery-center-platform-id';
import { InventoryPlatformId } from './dto/inventory-platform-id';
import { PromotionPlatformId } from './dto/promotion-platform-id';
import { Promo } from '../promo/promo';
import { EnforcementPlatformId } from './dto/enforcement-platform-id';

@Injectable({ providedIn: 'root' })
export class PlatformIdRepository {
  constructor(private http: HttpClientService) {}

  public encodeContractId(
    contractPlatformId: ContractPlatformId,
  ): Observable<EncodedPlatformId> {
    return this.http.post<ContractPlatformId, EncodedPlatformId>(
      Endpoints.PLATFORM_ID_ENCODE_CONTRACT,
      contractPlatformId,
    );
  }

  public encodeDeliveryCenterId(
    ddcPlatformId: DeliveryCenterPlatformId,
  ): Observable<EncodedPlatformId> {
    return this.http.post<DeliveryCenterPlatformId, EncodedPlatformId>(
      Endpoints.PLATFORM_ID_ENCODE_DELIVERY_CENTER,
      ddcPlatformId,
    );
  }

  public encodeInventoryId(
    platformId: InventoryPlatformId,
  ): Observable<EncodedPlatformId> {
    return this.http.post<InventoryPlatformId, EncodedPlatformId>(
      Endpoints.PLATFORM_ID_ENCODE_INVENTORY,
      platformId,
    );
  }

  public encodePromotionId(
    platformId: PromotionPlatformId,
  ): Observable<EncodedPlatformId> {
    return this.http.post<PromotionPlatformId, EncodedPlatformId>(
      Endpoints.PLATFORM_ID_ENCODE_PROMOTION,
      platformId,
    );
  }

  public encodeEnforcementId(
    platformId: EnforcementPlatformId,
  ): Observable<EncodedPlatformId> {
    return this.http.post<EnforcementPlatformId, EncodedPlatformId>(
      Endpoints.PLATFORM_ID_ENCODE_ENFORCEMENT,
      platformId,
    );
  }

  public decodeContractId(platformId: string): Observable<ContractPlatformId> {
    return this.http.get<ContractPlatformId>(
      RouteUtils.setPathParams(Endpoints.PLATFORM_ID_DECODE_CONTRACT, [
        platformId,
      ]),
    );
  }
}
