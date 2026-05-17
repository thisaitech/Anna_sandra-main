const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('buildInvoiceData'));
const patterns = ['grandTotal: totals', 'totals.total', 'calculateInvoiceTotals', 'taxMode', 'without', 'createInvoiceOnly', 'updateInvoiceFromForm', 'editingInvoiceId'];
for (const p of patterns) {
  const i = src.indexOf(p);
  if (i >= 0) console.log('\n===', p, '===\n', src.substring(Math.max(0, i - 80), i + 600));
}
