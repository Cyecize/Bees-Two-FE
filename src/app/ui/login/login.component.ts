import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/form-controls/input/input.component';
import { ShowLoader } from '../../shared/loader/show.loader.decorator';
import { AuthenticationService } from '../../api/auth/authentication.service';
import { FieldError } from '../../shared/field-error/field-error';
import { RouteNavigator } from '../../shared/routing/route-navigator.service';
import { AppRoutingPath } from '../../app-routing.path';
import { ErrorMessageComponent } from '../../shared/field-error/error-message/error-message.component';
import { CountryEnvironmentService } from '../../api/env/country-environment.service';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup<LoginForm>;
  errors: FieldError[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private nav: RouteNavigator,
    private envService: CountryEnvironmentService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup<LoginForm>({
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  @ShowLoader()
  async onFormSubmit(): Promise<void> {
    const res = await this.authenticationService.login(this.form.getRawValue());

    console.log(res);
    this.errors = res.errors;

    if (res.isSuccess) {
      await this.envService.reInit();
      this.nav.navigate(AppRoutingPath.HOME);
    }
  }
}

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
