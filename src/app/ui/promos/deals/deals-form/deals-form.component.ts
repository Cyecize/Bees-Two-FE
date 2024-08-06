import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  CreateDealsPayload,
  DealPayload,
} from '../../../../api/deals/payloads/create-deals.payload';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DealIdType } from '../../../../api/deals/enums/deal-id-type';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { EnvOverrideFieldComponent } from '../../../env/env-override-field/env-override-field.component';
import { NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../shared/form-controls/select/select.component';
import {
  SelectOption,
  SelectOptionKey,
} from '../../../../shared/form-controls/select/select.option';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { Deal } from '../../../../api/deals/deal';

interface DealsForm {
  ids: FormArray<FormControl<string>>;
  type: FormControl<DealIdType>;
}

@Component({
  selector: 'app-deals-form',
  standalone: true,
  imports: [
    EnvOverrideFieldComponent,
    ReactiveFormsModule,
    NgForOf,
    SelectComponent,
    InputComponent,
    NgIf,
    FormsModule,
  ],
  templateUrl: './deals-form.component.html',
  styleUrl: './deals-form.component.scss',
})
export class DealsFormComponent implements OnInit, OnDestroy {
  private _deals: Deal[] = [];
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  form!: FormGroup<DealsForm>;
  dealIdTypes: SelectOption[] = [];

  @Input()
  set deals(val: Deal[]) {
    this._deals = val;
    if (val.length > 0) {
      const objects: string[] = [];
      val.forEach((deal) => {
        objects.push(JSON.stringify(deal, null, 2));
      });

      this.rawJson = objects.join('\n,');
    }
  }

  @Input()
  dealIdType!: DealIdType;

  @Input()
  dealIdValue!: string;

  raw = true;

  rawJson = '';

  @Output()
  formSubmitted = new EventEmitter<CreateDealsPayload>();

  constructor(private envOverrideService: EnvOverrideService) {}

  ngOnInit(): void {
    this.dealIdTypes = Object.keys(DealIdType).map(
      (key) => new SelectOptionKey(key),
    );

    this.form = new FormGroup<DealsForm>({
      ids: new FormArray<FormControl<string>>([], {
        validators: [Validators.required],
      }),
      type: new FormControl<DealIdType>(DealIdType.ACCOUNT, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
    });

    if (this.dealIdType) {
      this.form.controls.type.setValue(this.dealIdType);
      this.addId(this.dealIdValue);
    }
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  get ids(): FormArray {
    return this.form.controls.ids;
  }

  onRawFormSubmit(): void {
    let data: DealPayload[];
    try {
      data = JSON.parse(`[${this.rawJson}]`) as DealPayload[];
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    this.formSubmitted.emit({
      ...this.form.getRawValue(),
      deals: data,
    });
  }

  addId(id: string): void {
    this.ids.push(new FormControl<string>(id, Validators.required));
  }

  removeId(idInd: number): void {
    this.ids.removeAt(idInd);
  }
}
