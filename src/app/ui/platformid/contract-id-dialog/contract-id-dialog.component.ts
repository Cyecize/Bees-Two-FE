import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { PlatformIdService } from '../../../api/platformid/platform-id.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EncodedPlatformId } from '../../../api/platformid/dto/encoded-platform-id';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';

interface ContractIdForm {
  vendorId: FormControl<string>;
  vendorAccountId: FormControl<string>;
}

@Component({
  selector: 'app-contract-id-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgIf, TooltipSpanComponent],
  templateUrl: './contract-id-dialog.component.html',
  styleUrl: './contract-id-dialog.component.scss',
})
export class ContractIdDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  form!: FormGroup<ContractIdForm>;
  encodedId?: EncodedPlatformId;

  constructor(private platformIdService: PlatformIdService) {
    super();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  ngOnInit(): void {
    this.setTitle('Create Contract ID');

    this.form = new FormGroup<ContractIdForm>({
      vendorId: new FormControl<string>(this.payload.vendorId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vendorAccountId: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  async onFormSubmit(): Promise<void> {
    this.encodedId = undefined;
    this.encodedId = await this.encode();
  }

  private async encode(): Promise<EncodedPlatformId> {
    return await this.platformIdService.encodeContract(this.form.getRawValue());
  }
}
