import { RequestTemplateDtoForSearch } from '../../../../api/template/request-template';
import { PreviewTemplateTab } from './preview-template-tab';

export class PreviewTemplateDialogPayload {
  constructor(
    public template: RequestTemplateDtoForSearch,
    public tab: PreviewTemplateTab,
    public isMultiEnvRun: boolean,
  ) {}
}
