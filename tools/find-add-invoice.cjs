const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('closeCurrentTab'));

for (const p of [
  'previewIndianInvoiceNumber',
  'applyAutoInvoiceNumber',
  'setViewMode("create")',
  "setViewMode('create')",
  'addInvoiceTab',
  'handleCreate',
  '+ Add',
  'newTab',
]) {
  let i = 0;
  let c = 0;
  while ((i = src.indexOf(p, i)) >= 0 && c < 2) {
    console.log('\n---', p, '---');
    console.log(src.substring(i - 80, i + 200).replace(/\n/g, ' '));
    c++;
    i++;
  }
}
