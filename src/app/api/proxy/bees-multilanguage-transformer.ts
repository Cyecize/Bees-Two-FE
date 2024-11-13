import { BeesResponsePerLanguage } from './bees-response-per-language';
import { BeesResponse } from './bees-response';

export interface BeesMultilanguageTransformer<T> {
  transform(
    multilanguageResponse: BeesResponsePerLanguage<T>[],
  ): BeesResponse<T>;
}

export abstract class BeesMultilanguageTransformerBase<T>
  implements BeesMultilanguageTransformer<T>
{
  transform(
    multilanguageResponse: BeesResponsePerLanguage<T>[],
  ): BeesResponse<T> {
    if (!multilanguageResponse || !multilanguageResponse.length) {
      console.warn('Empty multilanguage response received!');
      return undefined!;
    }

    if (multilanguageResponse.length === 1) {
      const res = multilanguageResponse[0];
      if (!res.beesResponse.env.singleLanguage) {
        console.warn(
          'Multi language country only received response for one language!',
          res.beesResponse.env,
        );
      }

      const response = multilanguageResponse[0]?.beesResponse;
      this.finalize(response);
      return response;
    }

    const defaultLanguage: string =
      multilanguageResponse[0].beesResponse.env.defaultLanguage?.languageCode;

    let mainBeesResponse = multilanguageResponse.find(
      (r) => r.languageCode === defaultLanguage,
    );

    if (!mainBeesResponse) {
      mainBeesResponse = multilanguageResponse[0];
    }

    multilanguageResponse = multilanguageResponse.filter(
      (r) => r.languageCode !== mainBeesResponse?.languageCode,
    );

    const response = this.doTransform(mainBeesResponse, multilanguageResponse);
    this.finalize(response);
    return response;
  }

  abstract doTransform(
    mainLanguageResponse: BeesResponsePerLanguage<T>,
    otherLanguageResponses: BeesResponsePerLanguage<T>[],
  ): BeesResponse<T>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  finalize(response: BeesResponse<T>): void {
    // Override me if you need to do any customizations
  }
}
