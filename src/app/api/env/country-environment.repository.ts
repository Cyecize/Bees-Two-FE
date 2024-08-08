import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryEnvironmentModel } from './country-environment.model';
import { Endpoints } from '../../shared/http/endpoints';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';

@Injectable({ providedIn: 'root' })
export class CountryEnvironmentRepository {
  constructor(private http: HttpClientSecuredService) {}

  public getAllEnvs(): Observable<CountryEnvironmentModel[]> {
    return this.http.get<CountryEnvironmentModel[]>(Endpoints.ENVIRONMENTS);
  }
}
