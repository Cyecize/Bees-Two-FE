import { Injectable } from '@angular/core';
import { CountryEnvironmentRepository } from './country-environment.repository';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { STORAGE_SELECTED_ENV_ID_NAME } from '../../shared/general.constants';
import { ObjectUtils } from '../../shared/util/object-utils';

@Injectable({ providedIn: 'root' })
export class CountryEnvironmentService {
  private readonly selectedEnvSubject =
    new BehaviorSubject<CountryEnvironmentModel | null>(null);
  public readonly selectedEnv$ = this.selectedEnvSubject.asObservable();

  private allEnvs!: Promise<CountryEnvironmentModel[]>;

  constructor(private repository: CountryEnvironmentRepository) {
    this.init();
  }

  public getEnvs(): Promise<CountryEnvironmentModel[]> {
    return this.allEnvs;
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

  private async init(): Promise<void> {
    this.allEnvs = firstValueFrom(this.repository.getAllEnvs());

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
