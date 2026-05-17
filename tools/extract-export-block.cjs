const fs = require('fs');
const q = fs.readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const s = fs.readFileSync('../dist/assets/Sales-DxyuXk9a.js', 'utf8');

const start = q.indexOf('!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"CGST:"})');
console.log('Q broken block at', start);
console.log(q.slice(start, start + 1200));

const sStart = s.indexOf('k.totalCGST>0&&e.jsxs("motion.div",{className:"flex justify-between text-sm"');
console.log('\nS reference at', sStart);
if (sStart >= 0) console.log(s.slice(sStart, sStart + 1200));
