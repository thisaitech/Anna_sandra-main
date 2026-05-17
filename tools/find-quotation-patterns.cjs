const fs = require('fs');
const m = JSON.parse(
  fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js.map', 'utf8')
);
const src = m.sourcesContent[0];

const needles = [
  'Quotations',
  'Quotation',
  'quotation',
  'QTN',
  'isQuote',
  'quoteMode',
  'documentType',
  'invoiceType',
  'type: \'quote\'',
  "type: 'quote'",
  'type:"quote"',
  'GST%',
  'GST₹',
  'With GST',
  'showTax',
  'taxMode',
  'CGST',
  'calculateTotals',
  'exportQuotation',
  'pdfService',
];

for (const n of needles) {
  const i = src.indexOf(n);
  if (i >= 0) {
    console.log('\n===', n, '@', i, '===');
    console.log(src.substring(Math.max(0, i - 80), i + 200));
  }
}

// find page title / route config
const titleIdx = src.indexOf('Quotations');
console.log('\nFirst Quotations:', titleIdx);
const exportIdx = src.indexOf('export default');
console.log('export default near:', src.substring(exportIdx, exportIdx + 500));
