import { Injectable } from '@angular/core';
import { SharedClientRepository } from './shared-client.repository';
import {
  SharedClientQuery,
  SharedClientQueryImpl,
} from './shared-client.query';
import {
  FieldErrorWrapperLocal,
  WrappedResponseLocal,
} from '../../../shared/util/field-error-wrapper-local';
import { SharedClient } from './shared-client';
import { Page } from '../../../shared/util/page';
import { SharedClientPayload } from './shared-client.payload';
import { CountryEnvironmentModel } from '../country-environment.model';

/**
 * @monaco
 */
interface ISharedClientService {
  search(
    query: SharedClientQuery,
  ): Promise<WrappedResponseLocal<Page<SharedClient>>>;

  create(
    payload: SharedClientPayload,
  ): Promise<WrappedResponseLocal<SharedClient>>;

  delete(client: SharedClient): Promise<WrappedResponseLocal<any>>;

  assignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<any>>;

  unAssignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<any>>;

  findAllEnvs(client: SharedClient): Promise<WrappedResponseLocal<any>>;

  createQuery(): SharedClientQuery;
}

@Injectable({ providedIn: 'root' })
export class SharedClientService implements ISharedClientService {
  constructor(private repository: SharedClientRepository) {}

  public async search(
    query: SharedClientQuery,
  ): Promise<WrappedResponseLocal<Page<SharedClient>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.searchSharedClients(query),
    ).execute();
  }

  public async create(
    payload: SharedClientPayload,
  ): Promise<WrappedResponseLocal<SharedClient>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.createSharedClient(payload),
    ).execute();
  }

  public async delete(
    client: SharedClient,
  ): Promise<WrappedResponseLocal<any>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.deleteSharedClient(client.id),
    ).execute();
  }

  public async assignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<any>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.assignEnvironment(client.id, env.id),
    ).execute();
  }

  public async unAssignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<any>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.unAssignEnvironment(client.id, env.id),
    ).execute();
  }

  public async findAllEnvs(
    client: SharedClient,
  ): Promise<WrappedResponseLocal<CountryEnvironmentModel[]>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.getEnvsForClient(client.id),
    ).execute();
  }

  createQuery(): SharedClientQuery {
    return new SharedClientQueryImpl();
  }
}
