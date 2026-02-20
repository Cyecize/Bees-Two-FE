import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { UserService } from '../../../api/user/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangePasswordForm } from './change-password.form';
import { FieldError } from '../../../shared/field-error/field-error';
import { Observable } from 'rxjs';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { ShowLoader } from '../../../shared/loader/show.loader.decorator';
import { WrappedResponseLocal } from '../../../shared/util/field-error-wrapper-local';
import { User } from '../../../api/user/user';

@Component({
  template: `
    <form [formGroup]="form">
      <div class="mt-2">
        <app-input
          type="password"
          formControlName="currentPassword"
          placeholder="Current passsword"
          [errors]="errors"
        ></app-input>
      </div>
      <div class="mt-2">
        <app-input
          type="password"
          formControlName="newPassword"
          placeholder="New passsword"
          [errors]="errors"
        ></app-input>
      </div>
      <div class="mt-2">
        <app-input
          type="password"
          formControlName="confirmNewPassword"
          placeholder="Confirm passsword"
          [errors]="errors"
        ></app-input>
      </div>

      <div class="mt-2 text-end">
        <button
          class="btn btn-outline-dark"
          [disabled]="!form.valid"
          (click)="formSubmitted()"
        >
          Save
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [FormsModule, InputComponent, ReactiveFormsModule],
})
export class ChangePasswordDialog
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  form!: FormGroup<ChangePasswordForm>;
  errors: FieldError[] = [];

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      newPassword: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmNewPassword: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      currentPassword: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  @ShowLoader()
  async formSubmitted(): Promise<void> {
    this.errors = [];

    const resp: WrappedResponseLocal<User> =
      await this.userService.changePassword(this.form.getRawValue());
    this.errors = resp.errors;

    if (resp.isSuccess) {
      this.userService.fetchUser();
      super.close(undefined);
    }
  }
}
