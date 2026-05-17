const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
for (const p of ['exportToTallyExcel', 'ed("sale', 'getInvoices', 'Nt(', 'Ve)', 'Ve,', 'tally-export', 'exportUtils']) {
  let idx = 0;
  let count = 0;
  while ((idx = s.indexOf(p, idx)) >= 0 && count < 3) {
    console.log(p, 'at', idx, ':', s.substring(Math.max(0, idx - 80), idx + 200).replace(/\n/g, ' '));
    idx += p.length;
    count++;
  }
  if (count === 0) console.log(p, 'NOT FOUND');
}
