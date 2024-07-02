import {Injectable} from '@angular/core';
import {CountryEnvironmentRepository} from './country-environment.repository';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {CountryEnvironmentModel} from './country-environment.model';
import {STORAGE_SELECTED_ENV_ID_NAME} from '../../shared/general.constants';
import {ObjectUtils} from '../../shared/util/object-utils';

@Injectable({providedIn: 'root'})
export class CountryEnvironmentService {
  private selectedEnvSubject =
    new BehaviorSubject<CountryEnvironmentModel | null>(null);
  selectedEnv$ = this.selectedEnvSubject.asObservable();

  constructor(private repository: CountryEnvironmentRepository) {
    this.init();
  }

  public getAllEnvs(): Observable<CountryEnvironmentModel[]> {
    return this.repository.getAllEnvs();
  }

  public selectEnv(env: CountryEnvironmentModel): void {
    localStorage.setItem(STORAGE_SELECTED_ENV_ID_NAME, env.id + '');
    this.selectedEnvSubject.next(env);
  }

  private async init(): Promise<void> {
    const envId = localStorage.getItem(STORAGE_SELECTED_ENV_ID_NAME);
    if (ObjectUtils.isNil(envId)) {
      return;
    }

    try {
      const envs = await firstValueFrom(this.getAllEnvs());
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
