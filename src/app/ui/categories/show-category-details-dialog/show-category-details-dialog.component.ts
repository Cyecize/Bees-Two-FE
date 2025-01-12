import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowCategoryDetailsDialogPayload } from './show-category-details-dialog.payload';
import { DialogContentBaseComponent } from '../../../shared/dialog/dialogs/dialog-content-base.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CopyIconComponent } from '../../../shared/components/copy-icon/copy-icon.component';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { TooltipSpanComponent } from '../../../shared/components/tooltip-span/tooltip-span.component';
import { ObjectUtils } from '../../../shared/util/object-utils';
import { CategoryV3 } from '../../../api/categories/category-v3';
import { CategoryItem } from '../../../api/categories/models/category-item';

@Component({
  selector: 'app-show-category-details-dialog',
  standalone: true,
  imports: [
    RouterLink,
    CopyIconComponent,
    NgIf,
    TooltipSpanComponent,
    NgForOf,
    NgOptimizedImage,
  ],
  templateUrl: './show-category-details-dialog.component.html',
  styleUrl: './show-category-details-dialog.component.scss',
})
export class ShowCategoryDetailsDialogComponent
  extends DialogContentBaseComponent<ShowCategoryDetailsDialogPayload>
  implements OnInit
{
  dataJson!: string;
  showJson = false;
  childCategories: CategoryV3[] = [];
  showCategories = false;

  items: CategoryItem[] = [];
  showItems = false;

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.dataJson = JSON.stringify(this.payload.category, null, 2);
    if (this.payload.category.categories?.length) {
      this.childCategories = this.payload.category.categories;
    }

    if (this.payload.category.items?.length) {
      this.items = this.payload.category.items;
    }

    this.setTitle(`Category "${this.payload.category.name}" Details`);
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
    navigator.clipboard.writeText(this.dataJson);
  }

  delete(): void {
    alert('bout 2 delete!');
  }

  openDetailsDialog(category: CategoryV3): void {
    this.dialogService.open(
      ShowCategoryDetailsDialogComponent,
      '',
      new ShowCategoryDetailsDialogPayload(category, this.payload.selectedEnv),
    );
  }

  boolToYesNo = ObjectUtils.boolToYesNo;
  protected readonly JSON = JSON;
}
