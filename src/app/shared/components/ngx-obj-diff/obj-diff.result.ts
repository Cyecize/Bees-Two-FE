import { SafeHtml } from '@angular/platform-browser';

/**
 * @monaco
 */
export interface ObjDiffResult {
  object1View: SafeHtml;
  object2View: SafeHtml;
  diff: any;
  diffView: string;
  diffValueChanges: string;
}
