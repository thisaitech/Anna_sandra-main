const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');

const needles = [
  'function _billTotal',
  'tax:taxRate',
  'item.basePrice',
  'basePrice!==void 0',
  'taxMode||',
  'mapInvoiceItemsForEdit',
  'gstRate:item.tax',
  'taxRate??',
  'field==="taxMode"',
  'Re(d)',
  'originalTax',
];

for (const n of needles) {
  const i = s.indexOf(n);
  console.log(n, i >= 0 ? `found @${i}` : 'NOT FOUND');
  if (i >= 0) console.log('  ', s.substring(i, i + 120).replace(/\n/g, ' '));
}
