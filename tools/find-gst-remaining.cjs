const fs = require('fs');
const q = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const patterns = [
  /children:"TAX"/g,
  /children:"GST[^"]*"/g,
  /children:"Tax"/g,
  /uppercase tracking-wider[^}]{0,80}TAX/g,
  /visibleColumns|B\.tax|taxColumn/g,
];
for (const p of patterns) {
  const m = [...q.matchAll(p)];
  console.log(p, 'count', m.length);
  m.slice(0, 3).forEach((x) => console.log(' ', x.index, x[0].slice(0, 80)));
}

// Find Ns function (calculateTotals)
const nsIdx = q.indexOf('function Ns(');
console.log('Ns at', nsIdx);
if (nsIdx > 0) console.log(q.substring(nsIdx, nsIdx + 400));
