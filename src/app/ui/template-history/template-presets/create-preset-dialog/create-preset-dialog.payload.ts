import { RequestTemplateFull } from '../../../../api/template/request-template';

export class CreatePresetDialogPayload {
  constructor(public template: RequestTemplateFull) {}
}
