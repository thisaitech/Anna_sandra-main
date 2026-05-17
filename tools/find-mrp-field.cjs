const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('MRP</th>'));

const needles = [
  "updateItem(item.id, 'price'",
  'readOnly',
  'editingInvoiceId',
  'as &&',
  'item.price',
  'toFixed(2)',
  'disabled={',
  'pointer-events-none',
];

for (const p of needles) {
  let i = 0;
  let c = 0;
  while ((i = src.indexOf(p, i)) >= 0 && c < 8) {
    const ctx = src.substring(i - 100, i + 200);
    if (p === 'item.price' && !ctx.includes('updateItem') && !ctx.includes('input') && !ctx.includes('MRP')) {
      i++;
      continue;
    }
    console.log('\n---', p, '---');
    console.log(ctx.replace(/\n/g, ' '));
    c++;
    i++;
  }
}

// Find MRP td cell
const mrpIdx = src.indexOf('>MRP</th>');
const tbodyIdx = src.indexOf('invoiceItems.map', mrpIdx);
console.log('\ninvoiceItems.map near MRP at', tbodyIdx);
if (tbodyIdx > 0) console.log(src.substring(tbodyIdx, tbodyIdx + 4000));
