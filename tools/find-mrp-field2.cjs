const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('MRP</th>'));

let i = 0;
while ((i = src.indexOf('isEditingInvoice', i)) >= 0) {
  console.log('\n--- isEditingInvoice ---');
  console.log(src.substring(i - 50, i + 400).replace(/\n/g, ' '));
  i++;
}

// MRP cell - search for enteredPrice or item.price.toFixed in table
for (const p of ['enteredPrice', 'isEditingInvoice ?', 'item.price.toFixed', 'font-semibold text-slate']) {
  let j = 0;
  let c = 0;
  while ((j = src.indexOf(p, j)) >= 0 && c < 5) {
    const ctx = src.substring(j - 80, j + 250);
    if (ctx.includes('MRP') || ctx.includes('price') || ctx.includes('updateItem')) {
      console.log('\n---', p, '---');
      console.log(ctx.replace(/\n/g, ' '));
      c++;
    }
    j++;
  }
}
