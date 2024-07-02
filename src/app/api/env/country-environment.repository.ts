import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { Endpoints } from '../../shared/http/endpoints';

@Injectable({ providedIn: 'root' })
export class CountryEnvironmentRepository {
  constructor(private http: HttpClientService) {}

  public getAllEnvs(): Observable<CountryEnvironmentModel[]> {
    return this.http.get<CountryEnvironmentModel[]>(Endpoints.ENVIRONMENTS);
  }
}
