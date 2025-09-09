import { Injectable } from '@angular/core';
import { RequestMethod } from '../common/request-method';
import { RelayVersion } from './relay.version';
import { BeesParam } from '../common/bees-param';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { RelayRepository } from './relay.repository';
import { BeesEntity } from '../common/bees-entity';

/**
 * @monaco
 */
export interface IRelayService {
  send<T>(
    entity: BeesEntity,
    method: RequestMethod,
    version: RelayVersion,
    headers: BeesParam[],
    data?: string | null,
    targetEnvId?: number,
    templateId?: number,
    saveInHistory?: boolean,
  ): Observable<BeesResponse<T>>;
}

@Injectable({ providedIn: 'root' })
export class RelayService implements IRelayService {
  constructor(private repository: RelayRepository) {}

  public send<T>(
    entity: BeesEntity,
    method: RequestMethod,
    version: RelayVersion = RelayVersion.V1,
    headers: BeesParam[],
    data?: string | null,
    targetEnvId?: number,
    templateId?: number,
    saveInHistory?: boolean,
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
      templateId,
      saveInHistory,
    );
  }
}
