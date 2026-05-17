const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('grandTotal') && c.includes('formattedInvoices'));
const patterns = ['grandTotal', 'billTotal', 'subtotal', 'totalTax', 'mapInvoice', 'formattedInvoices', 'updateInvoiceFromForm', 'loadInvoicesFromDatabase'];
for (const p of patterns) {
  let idx = 0, n = 0;
  while (n < 2) {
    const i = src.indexOf(p, idx);
    if (i < 0) break;
    console.log('\n===', p, '===\n', src.substring(Math.max(0, i - 100), i + 450));
    idx = i + p.length;
    n++;
  }
}
