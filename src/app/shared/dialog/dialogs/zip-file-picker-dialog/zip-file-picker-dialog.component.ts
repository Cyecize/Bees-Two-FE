import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../dialog-content-base.component';
import { Observable } from 'rxjs';
import { ZipFilePickerResponse } from './zip-file-picker.response';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface ZipFileFormType {
  zipFile: FormControl<Blob>;
}

@Component({
  standalone: true,
  template: `
    <div class="dialog-content-container">
      <form [formGroup]="form">
        <div class="mt-2">
          <label
            >Choose a ZIP file
            <input
              formControlName="zipFile"
              type="file"
              id="zip-file"
              (change)="onFileSelected($event)"
            />
          </label>
        </div>
      </form>

      <div class="d-flex flex-wrap justify-content-end">
        <div class="p-2">
          <button (click)="closeAsNull()" class="btn btn-outline-danger">
            Cancel
          </button>
        </div>
        <div class="p-2">
          <button
            class="btn btn-outline-success"
            [disabled]="!form.valid"
            (click)="selectFile()"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [ReactiveFormsModule],
})
export class ZipFilePickerDialogComponent
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  form!: FormGroup<ZipFileFormType>;
  file: File | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      zipFile: new FormControl<Blob>(null!, {
        nonNullable: true,
        validators: this.zipFileValidator,
      }),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  closeAsNull(): void {
    this.close(new ZipFilePickerResponse(null));
  }

  getIcon(): Observable<string> {
    return this.noIcon();
  }

  selectFile(): void {
    this.close(new ZipFilePickerResponse(this.file));
  }

  private zipFileValidator(control: any): any {
    const fileName = control.value;
    if (fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      if (extension !== 'zip') {
        return { invalidFileType: true };
      }
    } else {
      return { fileRequired: true };
    }
    return null;
  }
}
