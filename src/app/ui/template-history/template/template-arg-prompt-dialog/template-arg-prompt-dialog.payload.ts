import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';
import { RequestTemplateArgView } from '../../../../api/template/arg/request-template-arg';

export class TemplateArgPromptDialogPayload {
  constructor(
    public env: CountryEnvironmentModel,
    public arg: RequestTemplateArgView,
    public textarea: boolean | null,
    public prefillExistingValue: boolean,
    public updateArg: boolean,
  ) {}
}
