const fs = require('fs');
const q = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const idx = q.indexOf('ITEM NAME');
console.log('Headers:', q.slice(idx, idx + 1800));
const idx2 = q.indexOf('w-64 space-y-2');
if (idx2 >= 0) console.log('\nTotals panel:', q.slice(idx2, idx2 + 2500));
