import { Component, OnInit } from '@angular/core';
import { DialogContentBaseComponent } from '../dialog-content-base.component';
import { Observable } from 'rxjs';
import { DialogService } from '../../dialog.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface StringReplaceForm {
  json: FormControl<string>;
  text: FormControl<string>;
}

@Component({
  standalone: true,
  styles: `
    .string-replacer-dialog {
      @media (min-width: 768px) {
        min-width: 600px;
      }
    }
  `,
  template: `
    <div class="p-2 string-replacer-dialog">
      <form [formGroup]="form">
        <div class="mt-2">
          <label for="jsonContent">Dictionary (Valid JSON)</label>
          <textarea
            id="jsonContent"
            class="mt-1 form-control"
            rows="10"
            [placeholder]="jsonContentExample"
            formControlName="json"
          ></textarea>
        </div>
        <div class="mt-2">
          <label for="text">String to replace</label>
          <textarea
            id="text"
            class="mt-1 form-control"
            rows="10"
            [placeholder]="textContentExample"
            formControlName="text"
          ></textarea>
        </div>

        <div class="mt-2 text-end">
          <button
            class="btn btn-outline-success"
            (click)="replaceAndCopy()"
            [disabled]="!form.valid"
          >
            Replace and Copy
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [ReactiveFormsModule],
})
export class StringReplacerDialog
  extends DialogContentBaseComponent<any>
  implements OnInit
{
  form!: FormGroup<StringReplaceForm>;
  jsonContentExample = JSON.stringify(
    {
      name: 'Test',
      age: 1,
      vendorItemId: '22_EA',
    },
    null,
    2,
  );

  textContentExample =
    'I am {name}! My age is {age} and my item is {vendorItemId}';

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.setTitle('String Replacer');

    this.form = new FormGroup<StringReplaceForm>({
      json: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      text: new FormControl<string>(null!, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getIcon(): Observable<string> {
    return this.warningTriangleIcon();
  }

  replaceAndCopy(): void {
    let json;
    try {
      json = JSON.parse(this.form.getRawValue().json);
    } catch (err) {
      alert('Your JSON is invalid!');
      return;
    }

    let text = this.form.getRawValue().text;
    for (const key of Object.keys(json)) {
      const regex = new RegExp(`{${key}}`, 'g');
      text = text.replace(regex, json[key]);
    }

    navigator.clipboard
      .writeText(text)
      .then(() => alert('Text copied to clipboard!'));
  }
}
