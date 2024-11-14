export interface CmsStorageResponse {
  file: string;
  prod: string;
  uat: string;
  sit: string;
  dev: string;
  message: string;
  finalUrl: string; //Custom field which takes one of the above fields based on env
}
