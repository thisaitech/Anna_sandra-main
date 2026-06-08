const fs = require('fs');
const inv = fs.readFileSync('dist/assets/invoiceService-wndk85Fv.js', 'utf8');
const patterns = ['getInvoices', '[getInvoices]', 'async function', 'export{', 'INVOICES'];
for (const p of patterns) {
  let pos = 0, n = 0;
  while ((pos = inv.indexOf(p, pos)) >= 0 && n < 5) {
    console.log('\n---', p, n, '---');
    console.log(inv.slice(Math.max(0,pos-60), pos+200));
    pos += p.length; n++;
  }
}
// exports at end
console.log('\nTAIL:', inv.slice(-500));
