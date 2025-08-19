import { Injectable } from '@angular/core';
import { ContractPlatformId } from './dto/contract-platform-id';
import { PlatformIdRepository } from './platform-id.repository';
import { firstValueFrom } from 'rxjs';
import { EncodedPlatformId } from './dto/encoded-platform-id';
import { DeliveryCenterPlatformId } from './dto/delivery-center-platform-id';
import { InventoryPlatformId } from './dto/inventory-platform-id';
import { PromotionPlatformId } from './dto/promotion-platform-id';
import { EnforcementPlatformId } from './dto/enforcement-platform-id';

/**
 * @monaco
 */
export interface IPlatformIdService {
  encodeContract(
    contractPlatformId: ContractPlatformId,
  ): Promise<EncodedPlatformId>;

  encodeDeliveryCenterId(
    contractPlatformId: DeliveryCenterPlatformId,
  ): Promise<EncodedPlatformId>;

  encodeInventoryId(
    contractPlatformId: InventoryPlatformId,
  ): Promise<EncodedPlatformId>;

  encodePromotionId(
    contractPlatformId: PromotionPlatformId,
  ): Promise<EncodedPlatformId>;

  encodeEnforcementId(
    contractPlatformId: EnforcementPlatformId,
  ): Promise<EncodedPlatformId>;

  decodeContractString(platformId: string): Promise<ContractPlatformId>;
}

@Injectable({ providedIn: 'root' })
export class PlatformIdService implements IPlatformIdService {
  constructor(private repository: PlatformIdRepository) {}

  public async encodeContract(
    contractPlatformId: ContractPlatformId,
  ): Promise<EncodedPlatformId> {
    return await firstValueFrom(
      this.repository.encodeContractId(contractPlatformId),
    );
  }

  public async encodeDeliveryCenterId(
    contractPlatformId: DeliveryCenterPlatformId,
  ): Promise<EncodedPlatformId> {
    return await firstValueFrom(
      this.repository.encodeDeliveryCenterId(contractPlatformId),
    );
  }

  public async encodeInventoryId(
    contractPlatformId: InventoryPlatformId,
  ): Promise<EncodedPlatformId> {
    return await firstValueFrom(
      this.repository.encodeInventoryId(contractPlatformId),
    );
  }

  public async encodePromotionId(
    contractPlatformId: PromotionPlatformId,
  ): Promise<EncodedPlatformId> {
    return await firstValueFrom(
      this.repository.encodePromotionId(contractPlatformId),
    );
  }

  public async encodeEnforcementId(
    contractPlatformId: EnforcementPlatformId,
  ): Promise<EncodedPlatformId> {
    return await firstValueFrom(
      this.repository.encodeEnforcementId(contractPlatformId),
    );
  }

  public async decodeContractString(
    platformId: string,
  ): Promise<ContractPlatformId> {
    return await firstValueFrom(this.repository.decodeContractId(platformId));
  }
}
