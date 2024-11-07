import { BeesResponse } from './bees-response';

export interface BeesResponsePerLanguage<TResponse> {
  languageCode: string;
  beesResponse: BeesResponse<TResponse>;
}
