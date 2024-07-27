import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { ContractPlatformId } from './dto/contract-platform-id';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/http/endpoints';
import { RouteUtils } from '../../shared/routing/route-utils';
import { EncodedPlatformId } from './dto/encoded-platform-id';

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

  public decodeContractId(platformId: string): Observable<ContractPlatformId> {
    return this.http.get<ContractPlatformId>(
      RouteUtils.setPathParams(Endpoints.PLATFORM_ID_DECODE_CONTRACT, [
        platformId,
      ]),
    );
  }
}
