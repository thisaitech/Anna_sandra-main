const fs = require('fs');
const m = JSON.parse(
  fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js.map', 'utf8')
);
const src = m.sourcesContent[0];

function show(label, idx, len = 400) {
  if (idx < 0) return console.log(label, 'NOT FOUND');
  console.log('\n===', label, '@', idx, '===');
  console.log(src.substring(idx, idx + len));
}

const searches = [
  '/quotations',
  'isQuotation',
  'isQuotePage',
  'quotationMode',
  'documentLabel',
  'pageTitle',
  'invoicePrefix',
  'QTN',
  'previewIndianInvoiceNumber',
  'visibleColumns',
  'gstPercent',
  'showGst',
  'tax:',
  'Tax',
  'Intra',
  'grandTotal',
  'noTax',
  'hideTax',
];

for (const s of searches) {
  let idx = 0;
  let count = 0;
  while ((idx = src.indexOf(s, idx)) >= 0 && count < 2) {
    show(s + (count ? '#' + count : ''), idx);
    idx += s.length;
    count++;
  }
  if (count === 0) console.log(s, 'NOT FOUND');
}
