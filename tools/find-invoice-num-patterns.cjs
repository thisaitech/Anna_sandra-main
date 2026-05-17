const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');

const patterns = [
  'ue("create")',
  "ue('create')",
  'addNewTab',
  'applyManualInvoiceNumber',
  'applyAutoInvoiceNumber',
  'resolveInvoiceNumberForSave',
  'isInvoiceNumberAuto',
  'previewIndianInvoiceNumber',
  'handleBackToList',
  'closeCurrentTab',
];

for (const p of patterns) {
  const i = s.indexOf(p);
  console.log(p, i >= 0 ? `@${i}` : 'NOT FOUND');
  if (i >= 0 && (p.includes('create') || p === 'addNewTab')) {
    console.log(' ', s.substring(i - 100, i + 150).replace(/\n/g, ' '));
  }
}
