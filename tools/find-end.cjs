const fs = require('fs');
const q = fs.readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const start = q.indexOf('!1&&e.jsxs("motion.div",{className:"hidden",children:[e.jsx("span",{className:"hidden",children:"CGST:"})');
const slice = q.slice(start, start + 1500);
console.log(slice);
const gt = slice.indexOf('Grand Total:');
console.log('after grand total:', JSON.stringify(slice.slice(gt, gt + 200)));
