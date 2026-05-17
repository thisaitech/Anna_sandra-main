const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/invoiceService-wndk85Fv.js', 'utf8');
const i = s.indexOf('async function');
// find getInvoices export - search for "sale"
const patterns = ['getInvoices', 'as ed', 'type==="sale"', 'items:'];
for (const p of ['getInvoices']) {
  let idx = 0, n = 0;
  while (n < 3) {
    const j = s.indexOf(p, idx);
    if (j < 0) break;
    console.log('\n===', p, j, '===\n', s.substring(j, j + 600));
    idx = j + p.length;
    n++;
  }
}
