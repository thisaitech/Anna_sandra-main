const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('addNewTab'));

const i = src.indexOf('const addNewTab');
console.log(src.substring(i, i + 1500));

// Find + Add button onClick
let j = 0;
let c = 0;
while ((j = src.indexOf('addNewTab', j)) >= 0 && c < 10) {
  const ctx = src.substring(j - 120, j + 120);
  if (ctx.includes('onClick') || ctx.includes('Add')) {
    console.log('\n--- addNewTab ref ---');
    console.log(ctx.replace(/\n/g, ' '));
    c++;
  }
  j++;
}

// handleEditInvoice applyManual
const k = src.indexOf('applyManualInvoiceNumber(fullInvoice.invoiceNumber)');
console.log('\nedit apply manual:', k);
if (k > 0) console.log(src.substring(k - 100, k + 200));
