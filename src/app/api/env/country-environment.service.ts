import { Injectable } from '@angular/core';
import { CountryEnvironmentRepository } from './country-environment.repository';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { STORAGE_SELECTED_ENV_ID_NAME } from '../../shared/general.constants';
import { ObjectUtils } from '../../shared/util/object-utils';
import {
  CountryEnvironmentQuery,
  CountryEnvironmentQueryImpl,
} from './country-environment.query';
import {
  FieldErrorWrapperLocal,
  IWrappedResponseLocal,
  WrappedResponseLocal,
} from '../../shared/util/field-error-wrapper-local';
import { Page } from '../../shared/util/page';
import { CountryCodeQuery } from './country-code.query';
import { CountryEnvironmentPayload } from './country-environment.payload';
import { EnvToken } from './env-token';
import { CountryEnvironmentCredsPayload } from './country-environment-creds.payload';

/**
 * @monaco
 */
export interface ICountryEnvironmentService {
  createEnv(
    payload: CountryEnvironmentPayload,
  ): Promise<WrappedResponseLocal<CountryEnvironmentModel>>;

  findByVendorId(vendorId: string): Promise<CountryEnvironmentModel[]>;
  updateCreds(payload: CountryEnvironmentCredsPayload): Promise<boolean>;
  save(
    env: CountryEnvironmentModel,
  ): Promise<IWrappedResponseLocal<CountryEnvironmentModel>>;
}

@Injectable({ providedIn: 'root' })
export class CountryEnvironmentService implements ICountryEnvironmentService {
  private readonly selectedEnvSubject =
    new BehaviorSubject<CountryEnvironmentModel | null>(null);
  public readonly selectedEnv$ = this.selectedEnvSubject.asObservable();

  private allEnvs!: Promise<CountryEnvironmentModel[]>;

  constructor(private repository: CountryEnvironmentRepository) {
    this.allEnvs = firstValueFrom(this.repository.getAllEnvs());
    void this.init();
  }

  public async getEnvs(): Promise<CountryEnvironmentModel[]> {
    try {
      return await this.allEnvs;
    } catch (err) {
      this.allEnvs = firstValueFrom(this.repository.getAllEnvs());
      return await this.getEnvs();
    }
  }

  public async searchEnvs(
    query: CountryEnvironmentQuery,
  ): Promise<WrappedResponseLocal<Page<CountryEnvironmentModel>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.searchEnvs(query),
    ).execute();
  }

  public async findByVendorId(
    vendorId: string,
  ): Promise<CountryEnvironmentModel[]> {
    const query: CountryEnvironmentQuery = new CountryEnvironmentQueryImpl();
    query.vendorId = vendorId;

    // TODO: 100 is a lot, but consider adding a while or
    query.page.pageSize = 100;

    const envs: CountryEnvironmentModel[] = [];

    const resp = await this.searchEnvs(query);

    if (!resp.isSuccess) {
      console.log(resp);
      throw new Error('Could not fetch environments!');
    }

    envs.push(...resp.response.content);

    return envs;
  }

  public async searchCountryCodes(
    query: CountryCodeQuery,
  ): Promise<WrappedResponseLocal<Page<string>>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.searchCountryCodes(query),
    ).execute();
  }

  public async createEnv(
    payload: CountryEnvironmentPayload,
  ): Promise<WrappedResponseLocal<CountryEnvironmentModel>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.createEnv(payload),
    ).execute();
  }

  public async updateCreds(
    payload: CountryEnvironmentCredsPayload,
  ): Promise<boolean> {
    const resp = await new FieldErrorWrapperLocal(() =>
      this.repository.updateCreds(payload),
    ).execute();

    if (!resp.isSuccess) {
      console.error(resp);
    }

    return resp.isSuccess;
  }

  public async save(
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<CountryEnvironmentModel>> {
    const id = env.id;
    return await new FieldErrorWrapperLocal(() =>
      this.repository.update(id, env),
    ).execute();
  }

  public async update(
    envId: number,
    env: CountryEnvironmentPayload,
  ): Promise<WrappedResponseLocal<CountryEnvironmentModel>> {
    const resp = await new FieldErrorWrapperLocal(() =>
      this.repository.update(envId, env),
    ).execute();

    if (resp.isSuccess) {
      await this.reInit();
    }

    return resp;
  }

  public async getToken(
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponseLocal<EnvToken>> {
    return await new FieldErrorWrapperLocal(() =>
      this.repository.getToken(env.id),
    ).execute();
  }

  public async findById(
    envId: number,
  ): Promise<CountryEnvironmentModel | null> {
    const allEnvs = await this.getEnvs();
    const env = allEnvs.filter((env) => env.id === envId);
    if (env.length === 1) {
      return env[0];
    }

    return null;
  }

  public selectEnv(env: CountryEnvironmentModel): void {
    localStorage.setItem(STORAGE_SELECTED_ENV_ID_NAME, env.id + '');
    this.selectedEnvSubject.next(env);
  }

  public getCurrentEnv(): CountryEnvironmentModel | null {
    return this.selectedEnvSubject.getValue();
  }

  public async reInit(): Promise<void> {
    await this.init();
  }

  private async init(): Promise<void> {
    const envId = localStorage.getItem(STORAGE_SELECTED_ENV_ID_NAME);
    if (ObjectUtils.isNil(envId)) {
      return;
    }

    try {
      const envs = await this.getEnvs();
      const res = envs.filter((env) => env.id === Number(envId));
      if (res.length !== 1) {
        alert(
          `Env with ID ${envId} does not exist! Clearing your ENV Selection!`,
        );
        localStorage.removeItem(STORAGE_SELECTED_ENV_ID_NAME);
      } else {
        this.selectedEnvSubject.next(res[0]);
      }
    } catch (err) {
      console.error(err);
      alert('Could not set env!');
    }
  }
}
