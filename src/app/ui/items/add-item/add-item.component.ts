import { Component, OnDestroy, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EnvOverrideService } from '../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { InputComponent } from '../../../shared/form-controls/input/input.component';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../../api/items/item.service';
import { ItemPayload } from '../../../api/items/item.payload';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit, OnDestroy {
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  rawJson = '';

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
    private itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      // this.reloadFilters();
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  async onRawFormSubmit(): Promise<void> {
    let data: ItemPayload;
    try {
      data = JSON.parse(this.rawJson) as ItemPayload;
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    const res = await this.itemService.addItem(data, this.envOverride);

    console.log(res);
    if (!res.isSuccess) {
      this.dialogService.openRequestResultDialog(res);
    }
  }
}

export const ADD_ITEM_ROUTES: Routes = [
  {
    path: '',
    component: AddItemComponent,
  },
];
