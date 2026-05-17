const fs = require('fs');
const q = fs.readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const s = fs.readFileSync('../dist/assets/Sales-DxyuXk9a.js', 'utf8');

const mark = 'className:"w-64 space-y-2"';
const qi = q.indexOf(mark);
const si = s.indexOf(mark);
console.log('Q:', q.slice(qi, qi + 2200));
console.log('\n---SALES---\n');
console.log('S:', s.slice(si, si + 2200));
