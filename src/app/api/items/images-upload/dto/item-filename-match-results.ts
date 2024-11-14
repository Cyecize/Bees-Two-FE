import { FilenameItemGroup } from './filename-item-group';

export interface ItemFilenameMatchResults {
  nonMatchingFileNames: string[];
  filenameGroups: FilenameItemGroup[];
}
