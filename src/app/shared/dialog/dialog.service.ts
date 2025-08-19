import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogContentBaseComponent } from './dialogs/dialog-content-base.component';
import { DialogComponent } from './dialogs/dialog.component';
import { DialogComponentPayload } from './dialogs/dialog.component.payload';
import { ShowCodeDialogComponent } from './dialogs/confirm-dialog/show-code-dialog.component';
import { WrappedResponse } from '../util/field-error-wrapper';
import { RequestResultDialogComponent } from './dialogs/request-result-dialog/request-result-dialog.component';
import { AccountPickerDialogComponent } from '../../ui/accounts-local/account-picker-dialog/account-picker-dialog.component';
import { CountryEnvironmentModel } from '../../api/env/country-environment.model';
import { LocalAccount } from '../../api/accounts/local/local-account';
import { AccountPickerDialogPayload } from '../../ui/accounts-local/account-picker-dialog/account-picker-dialog.payload';
import { BeesToken } from '../../api/env/token/bees-token';
import { BeesTokenOverrideDialogComponent } from '../../ui/env/token/bees-token-override-dialog/bees-token-override-dialog.component';
import { BeesAccountPickerDialogComponent } from '../../ui/accounts/bees-account-picker-dialog/bees-account-picker-dialog.component';
import { BeesAccountPickerDialogPayload } from '../../ui/accounts/bees-account-picker-dialog/bees-account-picker-dialog.payload';
import { AccountV1 } from '../../api/accounts/v1/account-v1';
import { PlatformIdType } from '../../api/platformid/platform-id.type';
import { ContractIdDialogComponent } from '../../ui/platformid/contract-id-dialog/contract-id-dialog.component';
import { DeliveryCenterIdDialogComponent } from '../../ui/platformid/delivery-center-id-dialog/delivery-center-id-dialog.component';
import { InventoryPlatformIdDialogComponent } from '../../ui/platformid/inventory-platform-id-dialog/inventory-platform-id-dialog.component';
import {
  IItemsPickerDialogPayload,
  ItemsPickerDialogPayload,
} from '../../ui/items/items-picker-dialog/items-picker-dialog.payload';
import { ItemsPickerDialogComponent } from '../../ui/items/items-picker-dialog/items-picker-dialog.component';
import { Item } from '../../api/items/item';
import { ShowCodePayload } from './dialogs/confirm-dialog/show-code-payload.model';
import { ConfirmDialogPayload } from './dialogs/show-code-dialog/confirm-dialog-payload.model';
import { ConfirmDialogComponent } from './dialogs/show-code-dialog/confirm-dialog.component';
import { RequestTemplateView } from '../../api/template/request-template';
import { PreviewTemplateDialogComponent } from '../../ui/template-history/template/preview-template-dialog/preview-template-dialog.component';
import { TemplatePlaygroundDialogResponse } from '../../ui/template-history/template/template-payload-playground-dialog/template-playground-dialog.response';
import { TemplatePlaygroundDialogPayload } from '../../ui/template-history/template/template-payload-playground-dialog/template-playground-dialog.payload';
import { TemplatePayloadPlaygroundDialog } from '../../ui/template-history/template/template-payload-playground-dialog/template-payload-playground-dialog';
import { TemplateArgPromptDialogComponent } from '../../ui/template-history/template/template-arg-prompt-dialog/template-arg-prompt-dialog.component';
import { TemplateArgPromptDialogPayload } from '../../ui/template-history/template/template-arg-prompt-dialog/template-arg-prompt-dialog.payload';
import { RequestTemplateArgView } from '../../api/template/arg/request-template-arg';
import { TemplateArgsPromptDialogResponse } from '../../ui/template-history/template/template-arg-prompt-dialog/template-args-prompt-dialog.response';
import { EnvPickerDialogResult } from '../../ui/env/env-picker-dialog/env-picker-dialog.result';
import { EnvPickerDialogComponent } from '../../ui/env/env-picker-dialog/env-picker-dialog.component';
import { EnvPickerDialogPayload } from '../../ui/env/env-picker-dialog/env-picker-dialog.payload';
import { GenericPickerOption } from './dialogs/generic-picker-dialog/generic-picker.option';
import { GenericPickerDialogComponent } from './dialogs/generic-picker-dialog/generic-picker-dialog.component';
import { GenericPickerResponse } from './dialogs/generic-picker-dialog/generic-picker-response.impl';
import { ShowAccountDetailsDialogComponent } from '../../ui/accounts/show-account-details-dialog/show-account-details-dialog.component';
import { ShowAccountDetailsDialogPayload } from '../../ui/accounts/show-account-details-dialog/show-account-details-dialog.payload';
import { PromotionPlatformIdDialogComponent } from '../../ui/platformid/promotion-platform-id-dialog/promotion-platform-id-dialog.component';
import { EnforcementPlatformIdDialogComponent } from '../../ui/platformid/enforcement-platform-id-dialog/enforcement-platform-id-dialog.component';

/**
 * @monaco
 */
export interface IDialogService {
  openConfirmDialog(
    message: string,
    title?: string,
    confirmMessage?: string,
  ): Observable<boolean>;

  openAccountPicker(
    env: CountryEnvironmentModel,
    hideActions?: boolean,
  ): Observable<LocalAccount>;

  openBeesAccountPicker(env: CountryEnvironmentModel): Observable<AccountV1>;

  openItemsPicker(
    payload: IItemsPickerDialogPayload,
  ): Observable<Item | undefined>;

  openShowCodeDialog(code: string, title?: string): Observable<void>;

  openRequestResultDialog(response: WrappedResponse<any>): Observable<boolean>;

  openBeesTokenOverrideDialog(
    env: CountryEnvironmentModel,
  ): Observable<BeesToken>;

  openTemplateArgPrompt(
    env: CountryEnvironmentModel,
    arg: RequestTemplateArgView,
    textarea?: boolean,
  ): Promise<string | null>;

  openPlatformIdDialog(
    env: CountryEnvironmentModel,
    type: PlatformIdType,
  ): void;

  openEnvPickerMultiselect(): Promise<CountryEnvironmentModel[]>;

  openGenericMultiselect<T>(
    options: GenericPickerOption<T>[],
    title?: string,
  ): Promise<T[]>;

  openAccountV1Details(
    account: AccountV1,
    env?: CountryEnvironmentModel,
  ): Promise<any>;
}

@Injectable({ providedIn: 'root' })
export class DialogService implements IDialogService {
  constructor(private matService: MatDialog) {}

  public open(
    component: ComponentType<DialogContentBaseComponent<any>>,
    title: string,
    dataPayload: any,
  ): MatDialogRef<DialogComponent> {
    return this.matService.open(DialogComponent, {
      data: new DialogComponentPayload(title, component, dataPayload),
      panelClass: 'custom-dialog-container',
    });
  }

  public openConfirmDialog(
    message: string,
    title?: string,
    confirmMessage?: string,
  ): Observable<boolean> {
    const dialogComponentMatDialogRef = this.open(
      ConfirmDialogComponent,
      title || 'Confirm',
      new ConfirmDialogPayload(message, confirmMessage),
    );

    return dialogComponentMatDialogRef
      .afterClosed()
      .pipe(map((value) => value || false));
  }

  public openShowCodeDialog(code: string, title?: string): Observable<void> {
    const dialogComponentMatDialogRef = this.open(
      ShowCodeDialogComponent,
      title || 'Review code',
      new ShowCodePayload(code),
    );

    return dialogComponentMatDialogRef.afterClosed();
  }

  public openRequestResultDialog(
    response: WrappedResponse<any>,
  ): Observable<boolean> {
    const dialogComponentMatDialogRef = this.open(
      RequestResultDialogComponent,
      'Bees Response',
      response,
    );

    return dialogComponentMatDialogRef
      .afterClosed()
      .pipe(map((value) => value || false));
  }

  public openAccountPicker(
    env: CountryEnvironmentModel,
    hideActions?: boolean,
    showDetailsButton?: boolean,
  ): Observable<LocalAccount> {
    return this.open(
      AccountPickerDialogComponent,
      '',
      new AccountPickerDialogPayload(env, hideActions, showDetailsButton),
    ).afterClosed();
  }

  public openBeesAccountPicker(
    env: CountryEnvironmentModel,
  ): Observable<AccountV1> {
    return this.open(
      BeesAccountPickerDialogComponent,
      'Pick Bees Account',
      new BeesAccountPickerDialogPayload(env),
    ).afterClosed();
  }

  public openItemsPicker(
    payload: IItemsPickerDialogPayload,
  ): Observable<Item | undefined> {
    return this.open(ItemsPickerDialogComponent, '', payload).afterClosed();
  }

  public openBeesTokenOverrideDialog(
    env: CountryEnvironmentModel,
  ): Observable<BeesToken> {
    return this.open(
      BeesTokenOverrideDialogComponent,
      'Bees Token Override',
      env,
    ).afterClosed();
  }

  public openTemplatePreviewDialog(
    template: RequestTemplateView,
  ): Observable<any> {
    return this.open(
      PreviewTemplateDialogComponent,
      `Preview ${template.name}`,
      template,
    ).afterClosed();
  }

  public openCodePlayground(
    payload: TemplatePlaygroundDialogPayload,
  ): Observable<TemplatePlaygroundDialogResponse> {
    return this.open(
      TemplatePayloadPlaygroundDialog,
      'Playground',
      payload,
    ).afterClosed();
  }

  public async openTemplateArgPrompt(
    env: CountryEnvironmentModel,
    arg: RequestTemplateArgView,
    textarea?: boolean,
  ): Promise<string | null> {
    const resp: TemplateArgsPromptDialogResponse = await firstValueFrom(
      this.open(
        TemplateArgPromptDialogComponent,
        '',
        new TemplateArgPromptDialogPayload(env, arg, textarea || false),
      ).afterClosed(),
    );

    if (!resp) {
      return await this.openTemplateArgPrompt(env, arg, textarea);
    }

    return resp.value;
  }

  public openPlatformIdDialog(
    env: CountryEnvironmentModel,
    type: PlatformIdType,
  ): void {
    switch (type) {
      case PlatformIdType.CONTRACT:
        this.open(ContractIdDialogComponent, '', env);
        break;
      case PlatformIdType.DELIVERY_CENTER:
        this.open(DeliveryCenterIdDialogComponent, '', env);
        break;
      case PlatformIdType.INVENTORY:
        this.open(InventoryPlatformIdDialogComponent, '', env);
        break;
      case PlatformIdType.PROMOTION:
        this.open(PromotionPlatformIdDialogComponent, '', env);
        break;
      case PlatformIdType.ENFORCEMENT_GENERAL:
        this.open(EnforcementPlatformIdDialogComponent, '', env);
        break;
      default:
        throw new Error(`Unsupported ${type} type of platform ID!`);
    }
  }

  public openEnvPicker(
    multiselect?: boolean,
  ): Observable<EnvPickerDialogResult | null> {
    return this.open(
      EnvPickerDialogComponent,
      '',
      new EnvPickerDialogPayload(multiselect || false),
    ).afterClosed();
  }

  public async openEnvPickerMultiselect(): Promise<CountryEnvironmentModel[]> {
    const res = await firstValueFrom(this.openEnvPicker(true));

    if (!res) {
      return this.openEnvPickerMultiselect();
    }

    return res.envs;
  }

  public async openGenericMultiselect<T>(
    options: GenericPickerOption<T>[],
    title?: string,
  ): Promise<T[]> {
    const res: GenericPickerResponse<T> = await firstValueFrom(
      this.open(
        GenericPickerDialogComponent,
        title || 'Select Items',
        options,
      ).afterClosed(),
    );

    if (!res) {
      return await this.openGenericMultiselect(options, title);
    }

    return res.items;
  }

  public async openAccountV1Details(
    account: AccountV1,
    env?: CountryEnvironmentModel,
  ): Promise<any> {
    this.open(
      ShowAccountDetailsDialogComponent,
      '',
      new ShowAccountDetailsDialogPayload(account, env),
    );
  }
}
