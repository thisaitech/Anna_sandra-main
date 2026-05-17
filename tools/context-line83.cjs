const q = require('fs').readFileSync('../dist/assets/Quotations-CWlEFrSk.js', 'utf8');
const lines = q.split('\n');
const line83 = lines[82];
const idx = line83.indexOf('k.total.toFixed(2)]})]})}),');
console.log('idx on line 83', idx);
console.log('before (2000 chars):', line83.slice(Math.max(0, idx - 2000), idx));
console.log('\nafter (500):', line83.slice(idx, idx + 500));
