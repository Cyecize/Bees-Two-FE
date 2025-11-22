import { RequestTemplateFull } from '../../../../api/template/request-template';

export class MultienvTemplateRunnerDialogPayload {
  constructor(public readonly template: RequestTemplateFull) {}
}
