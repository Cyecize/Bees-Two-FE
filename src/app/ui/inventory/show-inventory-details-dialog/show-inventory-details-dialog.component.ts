import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShowInventoryDetailsDialogPayload } from './show-inventory-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { NgIf } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { PlatformIdService } from '../../../api/platformid/platform-id.service';
import { InventoryService } from '../../../api/inventory/inventory.service';

@Component({
  selector: 'app-show-inventory-details-dialog',
  standalone: true,
  imports: [NgIf, TooltipSpanComponent],
  templateUrl: './show-inventory-details-dialog.component.html',
  styleUrl: './show-inventory-details-dialog.component.scss',
})
export class ShowInventoryDetailsDialogComponent
  extends DialogContentBaseComponent<ShowInventoryDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  showJson = false;
  constructor(
    private dialogService: DialogService,
    private platformIdService: PlatformIdService,
    private inventoryService: InventoryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.inventory, null, 2);
    this.setTitle('Inventory Details');
  }

  getEditRoute(): string {
    return 'TODO';
  }

  getEditRawRoute(): string {
    return 'TODO';
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  copy(): void {
    void navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    alert('bout 2 delete!');
  }

  async fetchV2(): Promise<void> {
    const platformId = await this.platformIdService.encodeInventoryId({
      vendorId: this.payload.inventory.vendorId,
      vendorDeliveryCenterId: this.payload.inventory.ddc,
      vendorItemId: this.payload.inventory.vendorItemId,
      vendorAccountId: null,
    });

    const q = this.inventoryService.newV2Query();
    q.inventoryPlatformIds.push(platformId.platformId);

    const resp = await this.inventoryService.searchStockV2(
      q,
      this.payload.selectedEnv,
    );

    if (!resp.isSuccess) {
      alert('Error while fetching V2');
      console.log(resp);
      return;
    }

    if (!resp.response.response.inventories.length) {
      alert('V2 Did not find anything!');
      return;
    }

    this.dialogService.openShowCodeDialog(
      JSON.stringify(resp.response.response, null, 2),
      'V2 Inventory Response',
    );
  }
}
