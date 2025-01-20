import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { ItemsPriceFetchDataCollectionDialogPayload } from './items-price-fetch-data-collection-dialog.payload';
import { PlatformIdService } from '../../../api/platformid/platform-id.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ItemsPriceFetchDataCollectDialogResponse } from './items-price-fetch-data-collect-dialog.response';

interface PriceFetchDataForm {
  vendorAccountId: FormControl<string>;
  priceListId: FormControl<string>;
}

@Component({
  selector: 'app-items-price-fetch-data-collect-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PaginationComponent,
    InputComponent,
    TooltipSpanComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './items-price-fetch-data-collect-dialog.component.html',
  styleUrl: './items-price-fetch-data-collect-dialog.component.scss',
})
export class ItemsPriceFetchDataCollectDialog
  extends DialogContentBaseComponent<ItemsPriceFetchDataCollectionDialogPayload>
  implements OnInit
{
  form!: FormGroup<PriceFetchDataForm>;

  constructor(
    private platformIdService: PlatformIdService,
    private dialogService: DialogService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Provide data for fetching prices');

    this.form = new FormGroup<PriceFetchDataForm>({
      priceListId: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      vendorAccountId: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  override getIcon(): Observable<string> {
    return super.noIcon();
  }

  async onFormSubmit(): Promise<void> {
    const contractId = await this.platformIdService.encodeContract({
      vendorAccountId: this.form.getRawValue().vendorAccountId,
      vendorId: this.payload.env.vendorId,
    });

    this.close(
      new ItemsPriceFetchDataCollectDialogResponse(
        contractId.platformId,
        this.form.getRawValue().priceListId,
      ),
    );
  }

  pickAccount(): void {
    this.dialogService
      .openBeesAccountPicker(this.payload.env)
      .subscribe((acc) => {
        if (acc) {
          this.form.patchValue({
            priceListId: acc.priceListId,
            vendorAccountId: acc.vendorAccountId,
          });
        }
      });
  }
}
