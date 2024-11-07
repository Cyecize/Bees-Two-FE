import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from './country-environment.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnvOverrideService {
  private readonly selectedEnvSubject = new BehaviorSubject<
    CountryEnvironmentModel | undefined
  >(undefined);
  public readonly envOverride$ = this.selectedEnvSubject.asObservable();

  public setEnv(env: CountryEnvironmentModel): void {
    const currentEnv = this.selectedEnvSubject.value;
    if (currentEnv?.id === env.id) {
      return;
    }

    this.selectedEnvSubject.next(env);
  }
}
