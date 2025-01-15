import { BulkAssignItemsCsvHeaders } from './bulk-assign-items-csv-headers';

export const bulkAssignItemsExampleJson = [
  {
    category: 'cat1',
    vendorItemId: '123435_EA',
    sortOrder: 0,
  },
  {
    category: 'cat1',
    vendorItemId: '54321_EA',
    sortOrder: 1,
  },
  {
    category: 'cat2',
    vendorItemId: '1111111',
    sortOrder: 0,
  },
];

const csvHeader = Object.values(BulkAssignItemsCsvHeaders).join(',');

export const bulkAssignItemsExampleCsv = `${csvHeader}
cat1,123435_EA,
cat1,54321_EA,1
cat2,1111111,`;
