import { RequestTemplateArg } from '../../../../api/template/arg/request-template-arg';
import { CountryEnvironmentModel } from '../../../../api/env/country-environment.model';

export class TemplatePlaygroundDialogPayload {
  constructor(
    public readonly code: string | null,
    public readonly args: RequestTemplateArg[],
    public readonly env: CountryEnvironmentModel,
  ) {}
}
