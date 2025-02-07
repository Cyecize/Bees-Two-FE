import {
  SelectOption,
  SelectOptionKey,
  SelectOptionKvp,
} from '../../shared/form-controls/select/select.option';
import { BeesEntity } from './bees-entity';
import { RelayVersion } from '../relay/relay.version';
import { RequestMethod } from './request-method';
import { RequestTemplateArgType } from '../template/arg/request-template-arg.type';
import { RequestTemplatePayloadType } from '../template/request-template-payload.type';

export class SelectOptions {
  public static beesEntityOptions(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(BeesEntity).map((ent) => new SelectOptionKey(ent)),
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

  public static templateArgTypes(): SelectOption[] {
    return [new SelectOptionKvp('Choose one', null)].concat(
      ...Object.keys(RequestTemplateArgType).map(
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
