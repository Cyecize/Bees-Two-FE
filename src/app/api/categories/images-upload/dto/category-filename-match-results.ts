import { FilenameCategoryGroup } from './filename-category-group';

export interface CategoryFilenameMatchResults {
  nonMatchingFileNames: string[];
  filenameGroups: FilenameCategoryGroup[];
}
