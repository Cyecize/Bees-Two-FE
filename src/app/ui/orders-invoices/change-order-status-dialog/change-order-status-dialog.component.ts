import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { ChangeOrderStatusDialogPayload } from './change-order-status-dialog.payload';
import { Observable } from 'rxjs';
import { OrderService } from '../../../api/orders/order.service';
import { OrderStatus } from '../../../api/orders/order.status';
import { DialogService } from '../../../shared/dialog/dialog.service';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../shared/form-controls/select/select.option';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../../../shared/form-controls/select/select.component';

interface OrderStatusForm {
  status: FormControl<OrderStatus>;
}

@Component({
  selector: 'app-change-order-status-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, SelectComponent],
  templateUrl: './change-order-status-dialog.component.html',
  styleUrl: './change-order-status-dialog.component.scss',
})
export class ChangeOrderStatusDialogComponent
  extends DialogContentBaseComponent<ChangeOrderStatusDialogPayload>
  implements OnInit
{
  form!: FormGroup<OrderStatusForm>;
  orderStatuses: SelectOption[] = [];

  constructor(
    private orderService: OrderService,
    private dialogService: DialogService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setTitle('Change order status');
    this.orderStatuses = [new SelectOptionKey('Choose', true)].concat(
      ...Object.keys(OrderStatus)
        .filter((s) => s !== OrderStatus.ALL)
        .map((st) => new SelectOptionKey(st)),
    );
    this.form = new FormGroup<OrderStatusForm>({
      status: new FormControl(null!, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  getIcon(): Observable<string> {
    return super.noIcon();
  }

  async formSubmitted(): Promise<void> {
    const res = await this.orderService.changeStatus(
      this.payload.order.orderNumber,
      this.form.getRawValue().status,
      this.payload.env,
    );

    if (!res.isSuccess) {
      this.dialogService.openRequestResultDialog(res);
      return;
    }

    this.dialogService
      .openConfirmDialog(
        'Request sent, refresh the order!',
        'Operation completed,',
        'OK',
      )
      .subscribe((val) => {
        this.close(true);
      });
  }
}
