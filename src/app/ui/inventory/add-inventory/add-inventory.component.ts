import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { InventoryItemType } from '../../../api/inventory/inventory-item-type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { InventoryService } from '../../../api/inventory/inventory.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { InventoryPayload } from '../../../api/inventory/dto/inventory.payload';

interface AddInventoryForm {
  deliveryCenterIds: FormArray<FormControl<string>>;
  inventories: FormArray<FormGroup<InventoryQuantityForm>>;
}

interface InventoryQuantityForm {
  vendorItemId: FormControl<string>;
  quantity: FormControl<number>;
  expirationDate: FormControl<string | null>;
  itemType: FormControl<InventoryItemType | null>;
  itemPackageId: FormControl<string | null>;
  isSimpleInventory: FormControl<boolean | null>;
}

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<AddInventoryForm>;

  constructor(
    private dialogService: DialogService,
    private inventoryService: InventoryService,
    private envOverrideService: EnvOverrideService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      if (!ObjectUtils.isNil(this.envOverride)) {
        this.envOverride = value;
      }
    });

    this.form = new FormGroup<AddInventoryForm>({
      deliveryCenterIds: new FormArray<FormControl<string>>([], {
        validators: [Validators.required],
      }),
      inventories: new FormArray<FormGroup<InventoryQuantityForm>>([], {
        validators: [Validators.required],
      }),
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  addDDCField(): void {
    this.form.controls.deliveryCenterIds.push(
      new FormControl<string>(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  removeDDCField(ind: number): void {
    this.form.controls.deliveryCenterIds.removeAt(ind);
  }

  addInventoryForm(): void {
    this.form.controls.inventories.push(
      new FormGroup<InventoryQuantityForm>({
        isSimpleInventory: new FormControl(null),
        itemPackageId: new FormControl(null),
        vendorItemId: new FormControl(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        quantity: new FormControl<number>(null!, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        expirationDate: new FormControl<string | null>(null),
        itemType: new FormControl<InventoryItemType | null>(
          InventoryItemType.VENDOR_ITEM,
        ),
      }),
    );
  }

  async onFormSubmit(): Promise<void> {
    const invPayload: InventoryPayload = this.form.getRawValue();

    const resp = await this.inventoryService.addStock(
      invPayload,
      this.envOverride,
    );

    this.dialogService.openRequestResultDialog(resp);
  }
}

export const ADD_INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: AddInventoryComponent,
  },
];
