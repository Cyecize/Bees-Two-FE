import { RequestTemplatePreset } from '../../../../api/template/arg/preset/request-template-preset';
import { RequestTemplateArgView } from '../../../../api/template/arg/request-template-arg';

export class PresetDetailsDialogPayload {
  constructor(
    public preset: RequestTemplatePreset,
    public argValues: RequestTemplateArgView[],
  ) {}
}
