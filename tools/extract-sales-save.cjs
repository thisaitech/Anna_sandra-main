const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const idx = m.sources.findIndex(s => s.includes('Sales'));
const src = m.sourcesContent[idx] || m.sourcesContent.find(c => c && c.includes('invoiceItems'));
if (!src) { console.log('no source'); process.exit(1); }
const patterns = ['items: invoiceItems', 'saveInvoice', 'invoiceItems.map', 'hsnCode', 'quantity:', 'qty:'];
for (const p of patterns) {
  const i = src.indexOf(p);
  if (i >= 0) console.log('\n---', p, '---\n', src.substring(Math.max(0, i - 200), i + 600));
}
