import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { RewardSetting } from '../../../../api/rewards/settings/rewards-settings-search.response';
import { RewardsSettingRulesPayload } from '../../../../api/rewards/settings/payloads/rewards-setting.payload';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { ItemsPickerDialogPayload } from '../../../items/items-picker-dialog/items-picker-dialog.payload';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';

interface RulesForm {
  rules: FormArray<FormGroup<RuleForm>>;
}

interface RuleForm {
  ruleId: FormControl<string>;
  categoryId: FormControl<string>;
  description: FormControl<string>;
  amountSpent: FormControl<number>;
  points: FormControl<number>;
  skus: FormArray<FormControl<string>>;
  items: FormArray<FormGroup<ItemForm>>;
}

interface ItemForm {
  itemId: FormControl<string>;
  vendorItemId: FormControl<string>;
  vendorId: FormControl<string>;
}

@Component({
  selector: 'app-rules-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, NgForOf, NgIf],
  templateUrl: './rules-form.component.html',
  styleUrls: ['./rules-form.component.scss'],
})
export class RulesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup<RulesForm>;

  @Input()
  existingSetting!: RewardSetting;

  @Input()
  metaFormValid!: boolean;

  @Output()
  formSubmitted: EventEmitter<RewardsSettingRulesPayload> =
    new EventEmitter<RewardsSettingRulesPayload>();

  envOverride!: CountryEnvironmentModel;
  envSub!: Subscription;

  constructor(
    private dialogService: DialogService,
    private envOverrideService: EnvOverrideService,
  ) {}

  ngOnDestroy() {
    this.envSub.unsubscribe();
  }

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value!;
    });

    this.form = new FormGroup<RulesForm>({
      rules: new FormArray<FormGroup<RuleForm>>([]),
    });

    if (this.existingSetting?.rules) {
      this.form.patchValue({ rules: this.existingSetting.rules });
      const rulesLen = this.existingSetting.rules.length;

      for (let ruleInd = 0; ruleInd < rulesLen; ruleInd++) {
        this.addRule();

        const ruleControl = this.rules.at(ruleInd);
        const rule = this.existingSetting.rules[ruleInd];
        ruleControl.patchValue(rule);

        const skusLen = rule.skus.length;
        for (let skuInd = 0; skuInd < skusLen; skuInd++) {
          this.addSku(ruleInd);
          const skuControl = this.getSkus(ruleInd).at(skuInd);
          skuControl.patchValue(rule.skus[skuInd]);
        }

        const itemsLen = rule.items.length;
        for (let itemInd = 0; itemInd < itemsLen; itemInd++) {
          this.addItem(ruleInd);
          const itemControl = this.getItems(ruleInd).at(itemInd);
          itemControl.patchValue(rule.items[itemInd]);
        }
      }
    }
  }

  get rules(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  getSkus(ruleIndex: number): FormArray {
    return this.rules.at(ruleIndex).get('skus') as FormArray;
  }

  getItems(ruleIndex: number): FormArray<FormGroup<ItemForm>> {
    return this.rules.at(ruleIndex).get('items') as FormArray;
  }

  addRule(): void {
    const ruleGroup = new FormGroup<RuleForm>({
      ruleId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categoryId: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amountSpent: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      points: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      skus: new FormArray<FormControl<string>>([]),
      items: new FormArray<FormGroup<ItemForm>>([]),
    });

    this.rules.push(ruleGroup);
  }

  addSku(ruleIndex: number): void {
    this.getSkus(ruleIndex).push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }

  addItem(ruleIndex: number): void {
    this.getItems(ruleIndex).push(
      new FormGroup<ItemForm>({
        itemId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        vendorItemId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        vendorId: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeRule(ruleInd: number): void {
    this.rules.removeAt(ruleInd);
  }

  removeSku(ruleIndex: number, skuInd: number): void {
    this.getSkus(ruleIndex).removeAt(skuInd);
  }

  removeItem(ruleIndex: number, itemInd: number): void {
    this.getItems(ruleIndex).removeAt(itemInd);
  }

  async onFormSubmit(): Promise<void> {
    // Ensure the form submissions emit the correct structure
    this.formSubmitted.emit(this.form.getRawValue());
  }

  pickItem(ruleInd: number, itemInd: number): void {
    const form = this.getItems(ruleInd).at(itemInd);
    this.dialogService
      .openItemsPicker(
        new ItemsPickerDialogPayload(
          this.envOverride,
          form.getRawValue().vendorItemId,
        ),
      )
      .subscribe((value) => {
        if (!value) {
          return;
        }

        form.patchValue({
          itemId: value.id,
          vendorId: value.vendorId,
          vendorItemId: value.vendorItemId,
        });
      });
  }
}
