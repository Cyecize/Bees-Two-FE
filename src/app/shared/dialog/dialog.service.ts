import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogContentBaseComponent } from './dialogs/dialog-content-base.component';
import { DialogComponent } from './dialogs/dialog.component';
import { DialogComponentPayload } from './dialogs/dialog.component.payload';
import { ShowCodeDialogComponent } from './dialogs/show-code-dialog/show-code-dialog.component';
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
import { IItemsPickerDialogPayload } from '../../ui/items/items-picker-dialog/items-picker-dialog.payload';
import { ItemsPickerDialogComponent } from '../../ui/items/items-picker-dialog/items-picker-dialog.component';
import { Item } from '../../api/items/item';
import { ShowCodePayload } from './dialogs/show-code-dialog/show-code-payload.model';
import { ConfirmDialogPayload } from './dialogs/confirm-dialog/confirm-dialog-payload.model';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { RequestTemplateDtoForSearch } from '../../api/template/request-template';
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
import { BeesContract } from '../../api/accounts/contracts/bees-contract';
import { ShowContractDetailsDialogComponent } from '../../ui/accounts/show-contract-details-dialog/show-contract-details-dialog.component';
import { ShowContractDetailsDialogPayload } from '../../ui/accounts/show-contract-details-dialog/show-contract-details-dialog.payload';
import { FlattenedInventory } from '../../api/inventory/dto/flattened-inventory';
import { ShowInventoryDetailsDialogComponent } from '../../ui/inventory/show-inventory-details-dialog/show-inventory-details-dialog.component';
import { ShowInventoryDetailsDialogPayload } from '../../ui/inventory/show-inventory-details-dialog/show-inventory-details-dialog.payload';
import { ZipFilePickerDialogComponent } from './dialogs/zip-file-picker-dialog/zip-file-picker-dialog.component';
import { ZipFilePickerResponse } from './dialogs/zip-file-picker-dialog/zip-file-picker.response';
import { ObjDiffDialogComponent } from './dialogs/obj-diff-dialog/obj-diff-dialog.component';
import { ObjDiffDialogPayload } from './dialogs/obj-diff-dialog/obj-diff-dialog-payload.model';
import { TextareaDialogResponse } from './dialogs/textarea-dialog/textarea-dialog.response';
import { TextareaDialogComponent } from './dialogs/textarea-dialog/textarea-dialog.component';
import { TextareaDialogPayload } from './dialogs/textarea-dialog/textarea-dialog.payload';
import { PreviewTemplateDialogPayload } from '../../ui/template-history/template/preview-template-dialog/preview-template-dialog.payload';
import { PreviewTemplateTab } from '../../ui/template-history/template/preview-template-dialog/preview-template-tab';
import { RequestTemplatePreset } from '../../api/template/arg/preset/request-template-preset';
import { PresetDetailsDialogComponent } from '../../ui/template-history/template-presets/preset-details-dialog/preset-details-dialog.component';
import { PresetDetailsDialogPayload } from '../../ui/template-history/template-presets/preset-details-dialog/preset-details-dialog.payload';
import { ObjectUtils } from '../util/object-utils';
import { NotifyDialogComponent } from './dialogs/notify-dialog/notify-dialog.component';
import { NotifyDialogPayloadModel } from './dialogs/notify-dialog/notify-dialog-payload.model';

/**
 * @monaco
 */
export interface IDialogService {
  openConfirmDialog(
    message: string,
    title?: string,
    confirmMessage?: string,
  ): Observable<boolean>;

  openNotifyDialog(
    message: string,
    title?: string,
    closeMessage?: string,
  ): Promise<void>;

  openAccountPicker(
    env: CountryEnvironmentModel,
    hideActions?: boolean,
  ): Observable<LocalAccount>;

  openBeesAccountPicker(env: CountryEnvironmentModel): Observable<AccountV1>;

  openItemsPicker(
    payload: IItemsPickerDialogPayload,
  ): Observable<Item | undefined>;

  openShowCodeDialog(code: string, title?: string): Observable<void>;

  showFormattedContent(data: any, title?: string): Observable<void>;

  openRequestResultDialog(response: WrappedResponse<any>): Observable<boolean>;

  openBeesTokenOverrideDialog(
    env: CountryEnvironmentModel,
  ): Observable<BeesToken>;

  openTemplateArgPrompt(
    env: CountryEnvironmentModel,
    arg: RequestTemplateArgView,
    textarea?: boolean,
    prefillExistingValue?: boolean,
    updateArg?: boolean,
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

  openTextarea(
    existingText: string | null,
    title?: string,
  ): Promise<string | null>;

  openAccountV1Details(
    account: AccountV1,
    env?: CountryEnvironmentModel,
  ): Promise<any>;

  openBeesContractDetails(
    contract: BeesContract,
    env?: CountryEnvironmentModel,
  ): Promise<any>;

  openZipFilePicker(
    title?: string,
    requireNonNull?: boolean,
  ): Promise<File | null>;

  openObjDiff(obj1: any, obj2: any, title?: string): Promise<void>;
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

  public async openNotifyDialog(
    message: string,
    title?: string,
    closeMessage?: string,
  ): Promise<void> {
    const dialogComponentMatDialogRef = this.open(
      NotifyDialogComponent,
      title || 'Info',
      new NotifyDialogPayloadModel(message, closeMessage),
    );

    return firstValueFrom(dialogComponentMatDialogRef.afterClosed());
  }

  public openShowCodeDialog(code: string, title?: string): Observable<void> {
    const dialogComponentMatDialogRef = this.open(
      ShowCodeDialogComponent,
      title || 'Review code',
      new ShowCodePayload(code),
    );

    return dialogComponentMatDialogRef.afterClosed();
  }

  public showFormattedContent(data: any, title?: string): Observable<void> {
    data = ObjectUtils.formatIfJson(data);
    return this.openShowCodeDialog(data, title || 'Content');
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
      'Bees Token Override (Start With Bearer)',
      env,
    ).afterClosed();
  }

  public openTemplatePreviewDialog(
    template: RequestTemplateDtoForSearch,
    isMultiEnvRun: boolean,
  ): Observable<any> {
    return this.open(
      PreviewTemplateDialogComponent,
      `Preview ${template.name}`,
      new PreviewTemplateDialogPayload(
        template,
        PreviewTemplateTab.REQUEST_DETAILS,
        isMultiEnvRun,
      ),
    ).afterClosed();
  }

  public async openTemplatePresetDetails(
    preset: RequestTemplatePreset,
    argValues: RequestTemplateArgView[],
  ): Promise<boolean> {
    return await firstValueFrom(
      this.open(
        PresetDetailsDialogComponent,
        `Details for preset: ${preset.name}`,
        new PresetDetailsDialogPayload(preset, argValues),
      )
        .afterClosed()
        .pipe(map((val) => val === true)),
    );
  }

  public openCodePlayground(
    payload: TemplatePlaygroundDialogPayload,
  ): Observable<TemplatePlaygroundDialogResponse> {
    return this.matService
      .open(DialogComponent, {
        data: new DialogComponentPayload(
          'Playground',
          TemplatePayloadPlaygroundDialog,
          payload,
        ),
        panelClass: ['custom-dialog-container', 'playground-dialog-panel'],
      })
      .afterClosed();
  }

  public async openTemplateArgPrompt(
    env: CountryEnvironmentModel,
    arg: RequestTemplateArgView,
    //TODO: Deprecated field, rely on arg's enum
    textarea?: boolean,
    prefillExistingValue?: boolean,
    updateArg?: boolean,
  ): Promise<string | null> {
    const resp: TemplateArgsPromptDialogResponse = await firstValueFrom(
      this.open(
        TemplateArgPromptDialogComponent,
        '',
        new TemplateArgPromptDialogPayload(
          env,
          arg,
          textarea || null,
          prefillExistingValue || false,
          updateArg || false,
        ),
      ).afterClosed(),
    );

    if (!resp) {
      return await this.openTemplateArgPrompt(
        env,
        arg,
        textarea,
        prefillExistingValue,
        updateArg,
      );
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

  public async openTextarea(
    existingText: string | null,
    title?: string,
  ): Promise<string | null> {
    const res: TextareaDialogResponse = await firstValueFrom(
      this.open(
        TextareaDialogComponent,
        title || 'Provide value',
        new TextareaDialogPayload(existingText),
      ).afterClosed(),
    );

    if (!res) {
      return await this.openTextarea(existingText, title);
    }

    return res.value;
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

  public async openBeesContractDetails(
    contract: BeesContract,
    env?: CountryEnvironmentModel,
  ): Promise<any> {
    this.open(
      ShowContractDetailsDialogComponent,
      '',
      new ShowContractDetailsDialogPayload(contract, env),
    );
  }

  public async openInventoryDetails(
    inventory: FlattenedInventory,
    env?: CountryEnvironmentModel,
  ): Promise<any> {
    this.open(
      ShowInventoryDetailsDialogComponent,
      '',
      new ShowInventoryDetailsDialogPayload(inventory, env),
    );
  }

  public async openZipFilePicker(
    title?: string,
    requireNonNull = false,
  ): Promise<File | null> {
    const res: ZipFilePickerResponse = await firstValueFrom(
      this.open(
        ZipFilePickerDialogComponent,
        title || 'Select Zip File',
        null,
      ).afterClosed(),
    );

    if (!res) {
      return await this.openZipFilePicker(title, requireNonNull);
    }

    if (!res.file && requireNonNull) {
      return await this.openZipFilePicker(title, requireNonNull);
    }

    return res.file;
  }

  public async openObjDiff(
    obj1: any,
    obj2: any,
    title?: string,
  ): Promise<void> {
    return await firstValueFrom(
      this.open(
        ObjDiffDialogComponent,
        title || 'View difference',
        new ObjDiffDialogPayload(obj1, obj2),
      ).afterClosed(),
    );
  }
}
