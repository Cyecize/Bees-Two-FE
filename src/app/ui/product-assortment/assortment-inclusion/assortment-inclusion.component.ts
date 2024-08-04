import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AssortmentInclusionFormComponent } from '../assortment-inclusion-form/assortment-inclusion-form.component';
import { EnvOverrideFieldComponent } from '../../env/env-override-field/env-override-field.component';
import { AssortmentInclusionFormResult } from '../assortment-inclusion-form/assortment-inclusion-form.result';
import { ProductAssortmentService } from '../../../api/product-assortment/product-assortment.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-assortment-inclusion',
  standalone: true,
  imports: [AssortmentInclusionFormComponent, EnvOverrideFieldComponent],
  templateUrl: './assortment-inclusion.component.html',
  styleUrl: './assortment-inclusion.component.scss',
})
export class AssortmentInclusionComponent {
  constructor(
    private productAssortmentService: ProductAssortmentService,
    private dialogService: DialogService,
  ) {}

  async onFormSubmit(formData: AssortmentInclusionFormResult): Promise<void> {
    const result = await this.productAssortmentService.addAssortmentInclusion(
      formData.payload,
      formData.env,
    );

    this.dialogService.openRequestResultDialog(result);
  }
}

export const ASSORTMENT_INCLUSION_ROUTES: Routes = [
  {
    path: '',
    component: AssortmentInclusionComponent,
  },
];
