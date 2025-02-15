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

interface DDCForm {
  vendorId: FormControl<string>;
  vendorDeliveryCenterId: FormControl<string>;
}

@Component({
  selector: 'app-delivery-center-id-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgIf, TooltipSpanComponent],
  templateUrl: './delivery-center-id-dialog.component.html',
  styleUrl: './delivery-center-id-dialog.component.scss',
})
export class DeliveryCenterIdDialogComponent
  extends DialogContentBaseComponent<CountryEnvironmentModel>
  implements OnInit
{
  form!: FormGroup<DDCForm>;
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
    this.setTitle('Create Delivery Center ID');

    this.form = new FormGroup<DDCForm>({
      vendorId: new FormControl<string>(this.payload.vendorId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vendorDeliveryCenterId: new FormControl<string>(null!, {
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
    return await this.platformIdService.encodeDeliveryCenterId(
      this.form.getRawValue(),
    );
  }

  pickDeliveryCenterId(): void {
    this.dialogService.openBeesAccountPicker(this.payload).subscribe((acc) => {
      if (acc) {
        this.form.controls.vendorDeliveryCenterId.patchValue(
          acc.deliveryCenterId!,
        );
      }
    });
  }
}
