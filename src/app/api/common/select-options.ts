import {
  SelectOption,
  SelectOptionKey,
  SelectOptionKvp,
} from '../../shared/form-controls/select/select.option';
import { BeesEntity } from './bees-entity';
import { RelayVersion } from '../relay/relay.version';
import { RequestMethod } from './request-method';
import { TemplateArgDataType } from '../template/arg/template-arg-data.type';
import { RequestTemplatePayloadType } from '../template/request-template-payload.type';
import { Env } from '../env/env';
import { SharedClientSupportedMethod } from '../env/sharedclient/shared-client-supported-method';
import { TemplateArgPromptType } from '../template/arg/template-arg-prompt.type';
import { TemplateArgInputType } from '../template/arg/template-arg-input.type';

export class SelectOptions {
  public static beesEntityOptions(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(BeesEntity).map((ent) => new SelectOptionKey(ent)),
    );
  }

  public static sharedClientSupportedMethodsOptions(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(SharedClientSupportedMethod).map(
        (ent) => new SelectOptionKey(ent),
      ),
    );
  }

  public static envOptions(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(Env).map((ent) => new SelectOptionKey(ent)),
    );
  }

  public static dataIngestionVersionOptions(): SelectOption[] {
    return [new SelectOptionKvp('None (Not using Relay)', null)].concat(
      ...Object.keys(RelayVersion).map((rel) => new SelectOptionKey(rel)),
    );
  }

  public static methodOptions(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(RequestMethod).map(
        (method) => new SelectOptionKey(method),
      ),
    );
  }

  public static templateArgDataTypes(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(TemplateArgDataType).map(
        (method) => new SelectOptionKey(method),
      ),
    );
  }

  public static templatePromptTypes(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(TemplateArgPromptType).map(
        (method) => new SelectOptionKey(method),
      ),
    );
  }

  public static templateValueInputTypes(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(TemplateArgInputType).map(
        (method) => new SelectOptionKey(method),
      ),
    );
  }

  public static templatePayloadTypes(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(RequestTemplatePayloadType).map(
        (method) => new SelectOptionKey(method),
      ),
    );
  }
}
