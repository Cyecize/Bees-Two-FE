import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { UserRepository } from './user.repository';
import {
  FieldErrorWrapperLocal,
  WrappedResponseLocal,
} from '../../shared/util/field-error-wrapper-local';
import { PasswordReset } from './password-reset';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly currentUser: BehaviorSubject<User | undefined> =
    new BehaviorSubject<User | undefined>(undefined);
  public readonly currentUser$ = this.currentUser.asObservable();

  constructor(private userRepository: UserRepository) {}

  public fetchUser(): void {
    this.userRepository
      .getUser()
      .subscribe((value) => this.currentUser.next(value));
  }

  public clearUser(): void {
    this.currentUser.next(undefined);
  }

  async changePassword(
    payload: PasswordReset,
  ): Promise<WrappedResponseLocal<User>> {
    return await new FieldErrorWrapperLocal(() =>
      this.userRepository.resetPassword(payload),
    ).execute();
  }
}
