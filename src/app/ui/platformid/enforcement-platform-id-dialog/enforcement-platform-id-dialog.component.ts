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
import { DialogService } from '../../../shared/dialog/dialog.service';

interface EnforcementIdForm {
  vendorId: FormControl<string>;
  vendorAccountId: FormControl<string | null>;
  entity: FormControl<string>;
  entityId: FormControl<string>;
  vendorDeliveryCenterId: FormControl<string | null>;
}

@Component({
  selector: 'app-enforcement-platform-id-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgIf, TooltipSpanComponent],
  templateUrl: './enforcement-platform-id-dialog.component.html',
  styleUrl: './enforcement-platform-id-dialog.component.scss',
})
export class EnforcementPlatformIdDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  form!: FormGroup<EnforcementIdForm>;
  encodedId?: EncodedPlatformId;

  constructor(
    private platformIdService: PlatformIdService,
    private dialogService: DialogService,
  ) {
    super();
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  ngOnInit(): void {
    this.setTitle('Create Enforcement Platform ID');

    this.form = new FormGroup<EnforcementIdForm>({
      vendorId: new FormControl<string>(this.payload.vendorId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vendorAccountId: new FormControl<string | null>(null),
      vendorDeliveryCenterId: new FormControl<string | null>(null!),
      entity: new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      entityId: new FormControl<string>(null!, {
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
    return await this.platformIdService.encodeEnforcementId(
      this.form.getRawValue(),
    );
  }

  pickDDCAndAccountId(): void {
    this.dialogService.openBeesAccountPicker(this.payload).subscribe((acc) => {
      if (acc) {
        this.form.patchValue({
          vendorAccountId: acc.vendorAccountId,
          vendorDeliveryCenterId: acc.deliveryCenterId,
          vendorId: acc.vendorId,
        });
      }
    });
  }
}
