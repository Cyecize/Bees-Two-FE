import { Injectable } from '@angular/core';
import { CountryEnvironmentQuery } from '../../../api/env/country-environment.query';

@Injectable({ providedIn: 'root' })
export class EnvPickerDialogService {
  private query: CountryEnvironmentQuery | null = null;

  public getQuery(): CountryEnvironmentQuery | null {
    return this.query;
  }

  public setQuery(query: CountryEnvironmentQuery): void {
    this.query = query;
  }
}
