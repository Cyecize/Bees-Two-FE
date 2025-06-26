import { Injectable } from '@angular/core';
import { SharedClientRepository } from './shared-client.repository';
import {
  SharedClientQuery,
  SharedClientQueryImpl,
} from './shared-client.query';
import {
  FieldErrorWrapperLocal,
  IWrappedResponseLocal,
  WrappedResponseLocal,
} from '../../../shared/util/field-error-wrapper-local';
import { SharedClient } from './shared-client';
import { Page } from '../../../shared/util/page';
import { SharedClientPayload } from './shared-client.payload';
import { CountryEnvironmentModel } from '../country-environment.model';
import { SharedClientToken } from './shared-client-token';

/**
 * @monaco
 */
export interface ISharedClientService {
  search(
    query: SharedClientQuery,
  ): Promise<IWrappedResponseLocal<Page<SharedClient>>>;

  create(
    payload: SharedClientPayload,
  ): Promise<IWrappedResponseLocal<SharedClient>>;

  delete(client: SharedClient): Promise<IWrappedResponseLocal<any>>;

  assignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<IWrappedResponseLocal<any>>;

  unAssignEnvironment(
    client: SharedClient,
    env: CountryEnvironmentModel,
  ): Promise<IWrappedResponseLocal<any>>;

  findAllEnvs(client: SharedClient): Promise<IWrappedResponseLocal<any>>;

  getToken(
    client: SharedClient,
  ): Promise<IWrappedResponseLocal<SharedClientToken>>;

  createQuery(): SharedClientQuery;

  findAllAssignedClients(
    payload: CountryEnvironmentModel,
  ): Promise<IWrappedResponseLocal<SharedClient[]>>;
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

  public async getToken(
    client: SharedClient,
  ): Promise<WrappedResponseLocal<SharedClientToken>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.getToken(client.id),
    ).execute();
  }

  public createQuery(): SharedClientQuery {
    return new SharedClientQueryImpl();
  }

  public async findAllAssignedClients(
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<SharedClient[]>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.getAssignedClientsForEnv(env.id),
    ).execute();
  }
}
