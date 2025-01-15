import { CategoryGroupType } from '../../../api/categories/category-group.type';
import { BulkCreateCategoriesCsvHeaders } from './bulk-create-categories-csv-headers';

export const exampleBulkCategoriesCreationJson = [
  {
    name: 'Level 1 Category (Only essential fields)',
    childCategories: [
      {
        name: 'Level 2 category',
      },
      {
        name: 'Another Level 2 category',
        sortOrder: 1,
        childCategories: [
          {
            name: 'Level 3 category',
          },
        ],
      },
    ],
  },
  {
    name: 'Another Level 1 Category',
    sortOrder: 0,
    groups: [
      CategoryGroupType.MAIN,
      CategoryGroupType.REWARDS,
      CategoryGroupType.FEATURED,
    ],
    translations: {
      'en-CA': {
        name: 'Level 1',
      },
      'fr-CA': {
        name: 'Le Level 1',
      },
    },
    restricted: ['restrictions'],
    storeCategoryId: 'level1_store_cat_id',
    childCategories: [
      {
        name: 'Level 2 category',
        sortOrder: 0,
        translations: {
          'en-CA': {
            name: 'Level 2',
          },
        },
      },
    ],
  },
];

export const bulkCreateCategoriesCsvHeaders = Object.values(
  BulkCreateCategoriesCsvHeaders,
).join(',');

export const exampleBulkCategoriesCreationCsv = `${bulkCreateCategoriesCsvHeaders}
Sweets,,,,,,,
Sweets,Ice Cream,,,,,,
Sweets,Ice Cream,Chocolate Ice Cream,0,,,,Glace au chocolat
Sweets,Ice Cream,Vanilla Ice Cream,1,,,,
Sweets,Gingerbread,,,,,,
Sweets,Drinks,,,,,,
Sweets,Drinks,Chocolate Milk,,,,,
Drinks,,,0,"MAIN,REWARDS",,drinks_main,boissons
Drinks,Chocolate Milk,,,,,,
Drinks,Ice Tea,,,,,,`;
