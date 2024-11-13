import { BeesMultilanguageTransformerBase } from '../proxy/bees-multilanguage-transformer';
import { Item, ItemTranslation, ItemTranslationImpl } from './item';
import { BeesResponsePerLanguage } from '../proxy/bees-response-per-language';
import { BeesResponse } from '../proxy/bees-response';
import { ItemsSearchResponse } from './items-search.response';

export class ItemsTransformer extends BeesMultilanguageTransformerBase<ItemsSearchResponse> {
  doTransform(
    mainLanguageResponse: BeesResponsePerLanguage<ItemsSearchResponse>,
    otherLanguageResponses: BeesResponsePerLanguage<ItemsSearchResponse>[],
  ): BeesResponse<ItemsSearchResponse> {
    for (const item of mainLanguageResponse.beesResponse.response.items) {
      item.translations = {};
      // item.translations[mainLanguageResponse.languageCode] =
      //   this.createTranslation(item);

      for (const otherLanguageResponse of otherLanguageResponses) {
        const otherItem =
          otherLanguageResponse.beesResponse.response.items.find(
            (i) => i.id === item.id,
          );

        if (!otherItem) {
          console.warn(
            `Item ${item.itemName} with sku ${item.sku} does not have translation for ${otherLanguageResponse.languageCode}`,
          );
          continue;
        }

        item.translations[otherLanguageResponse.languageCode] =
          this.createTranslation(otherItem);
      }
    }

    return mainLanguageResponse.beesResponse;
  }

  // Update the item objects so that they are compatible with PUT V2 request
  override finalize(response: BeesResponse<ItemsSearchResponse>): void {
    const defaultLanguage = response.env.defaultLanguage.languageCode;

    for (const item of response.response.items) {
      item.image = item.itemImage;
      item.name = item.itemName;
      item.supplierShortName = item.supplier;
      item.defaultLanguage = defaultLanguage;

      item.sourceData = {
        vendorItemId: item.vendorItemId,
        mfrItemId: undefined, // This field is not present in V2 Item Response
        mfrShortCode: undefined, // This field is not present in V2 Item Response
      };

      item.package.id = item.package.packageId;
      item.package.count = item.package.unitCount;
    }
  }

  private createTranslation(item: Item): ItemTranslation {
    return new ItemTranslationImpl(
      item.brandName,
      item.classification,
      {
        name: item.container.name,
        material: item.container.material,
        unitOfMeasurement: item?.container.unitOfMeasurement,
      },
      item.description,
      item.distributorProductType,
      item.itemImage,
      item.itemType,
      item.itemName,
      {
        name: item?.package?.name,
        pack: item?.package?.pack,
        unitOfMeasurement: item?.package?.unitOfMeasurement,
      },
      item.styleType,
      item.subBrandName,
    );
  }
}
