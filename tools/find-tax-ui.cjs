const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const needles = ['TAX', 'Tax', 'GST%', 'GST\u20b9', 'With GST', 'Without GST', 'Subtotal', 'Grand Total'];

for (const t of needles) {
  let idx = 0;
  let n = 0;
  while ((idx = s.indexOf(t, idx)) >= 0 && n < 3) {
    console.log(`\n[${t} #${n}] @ ${idx}`);
    console.log(s.substring(idx - 60, idx + 100).replace(/\n/g, ' '));
    idx += t.length;
    n++;
  }
}
