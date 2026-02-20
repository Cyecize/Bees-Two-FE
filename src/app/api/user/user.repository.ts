import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { User } from './user';
import { Endpoints } from '../../shared/http/endpoints';
import { PasswordReset } from './password-reset';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  constructor(private http: HttpClientSecuredService) {}

  public getUser(): Observable<User> {
    return this.http.get<User>(Endpoints.USER_DETAILS);
  }

  public resetPassword(payload: PasswordReset): Observable<User> {
    return this.http.put<PasswordReset, User>(Endpoints.USER_PASSWORD, payload);
  }
}
