import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { InputComponent } from '../../../../shared/form-controls/input/input.component';
import { FormsModule } from '@angular/forms';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { Subscription } from 'rxjs';
import { ObjectUtils } from '../../../../shared/util/object-utils';
import { EnvOverrideService } from '../../../../api/env/env-override.service';
import { BeesTokenOverrideService } from '../../../../api/env/token/bees-token-override.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';

@Component({
  selector: 'app-override-auth-token-field',
  standalone: true,
  imports: [InputComponent, FormsModule],
  templateUrl: './override-auth-token-field.component.html',
  styleUrl: './override-auth-token-field.component.scss',
})
export class OverrideAuthTokenFieldComponent implements OnInit, OnDestroy {
  private _token!: string;
  private envOverride?: CountryEnvironmentModel;
  private envSub!: Subscription;

  @Input()
  autoPopulate = true;

  @Output()
  tokenChanged = new EventEmitter<string | undefined>();

  set token(val: string) {
    this._token = val;
    this.tokenChanged.next(val);
  }

  get token(): string {
    return this._token;
  }

  constructor(
    private envOverrideService: EnvOverrideService,
    private beesTokenOverrideService: BeesTokenOverrideService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.envSub = this.envOverrideService.envOverride$.subscribe((value) => {
      this.envOverride = value;
      if (!ObjectUtils.isNil(this.envOverride)) {
        if (!this.autoPopulate) {
          this.token = null!;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          this.token = this.beesTokenOverrideService.getBeesToken(
            value!,
          )?.token!;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.envSub.unsubscribe();
  }

  lookupToken(): void {
    this.dialogService
      .openBeesTokenOverrideDialog(this.envOverride!)
      .subscribe((token) => {
        if (!token) {
          return;
        }

        this.token = token.token;
      });
  }
}
