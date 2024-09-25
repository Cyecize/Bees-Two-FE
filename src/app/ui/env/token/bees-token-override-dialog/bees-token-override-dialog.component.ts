import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { CopyIconComponent } from '../../../../shared/components/copy-icon/copy-icon.component';
import { DialogContentBaseComponent } from '../../../../shared/dialog/dialogs/dialog-content-base.component';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { BeesTokenOverrideService } from '../../../../api/env/token/bees-token-override.service';
import { BeesToken, BeesTokenImpl } from '../../../../api/env/token/bees-token';
import { TooltipSpanComponent } from '../../../../shared/components/tooltip-span/tooltip-span.component';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface BeesTokenForm {
  token: FormControl<string>;
  expiresMinutes: FormControl<number>;
}

@Component({
  selector: 'app-bees-token-override-dialog',
  standalone: true,
  imports: [
    NgIf,
    CopyIconComponent,
    TooltipSpanComponent,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bees-token-override-dialog.component.html',
  styleUrl: './bees-token-override-dialog.component.scss',
})
export class BeesTokenOverrideDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  token!: BeesToken | null;
  form!: FormGroup<BeesTokenForm>;

  constructor(private beesTokenOverrideService: BeesTokenOverrideService) {
    super();
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  ngOnInit(): void {
    this.form = new FormGroup<BeesTokenForm>({
      token: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      expiresMinutes: new FormControl<number>(50, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[0-9]/)],
      }),
    });

    if (!this.payload) {
      return;
    }

    this.token = this.beesTokenOverrideService.getBeesToken(this.payload);
  }

  clearToken(): void {
    this.beesTokenOverrideService.clearToken(this.payload);
    this.token = null;
  }

  selectToken(): void {
    this.close(this.token);
  }

  saveTokenAndClose(): void {
    const value = this.form.getRawValue();

    const token = new BeesTokenImpl(
      value.token,
      new Date(new Date().getTime() + value.expiresMinutes * 60000),
      this.payload.id,
    );

    this.beesTokenOverrideService.addToken(token);
    this.token = token;
    this.selectToken();
  }
}
