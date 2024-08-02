import { Injectable } from '@angular/core';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from './relay.version';
import { BeesParamPayload } from '../proxy/bees-param.payload';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { RelayRepository } from './relay.repository';
import { BeesEntity } from '../common/bees-entity';

@Injectable({ providedIn: 'root' })
export class RelayService {
  constructor(private repository: RelayRepository) {}

  public send<T>(
    entity: BeesEntity,
    method: RequestMethod,
    version: RelayVersion = RelayVersion.V1,
    headers: BeesParamPayload[],
    data?: string | null,
    targetEnvId?: number,
  ): Observable<BeesResponse<T>> {
    return this.repository.call<T>(
      method,
      {
        payload: data,
        entity: entity,
        version: version,
      },
      headers,
      targetEnvId,
    );
  }
}
