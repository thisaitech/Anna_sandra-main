const fs = require('fs');
const m = JSON.parse(
  fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Quotations-CWlEFrSk.js.map', 'utf8')
);
const src = m.sourcesContent[0];

let idx = 0;
let n = 0;
while ((idx = src.indexOf('/quotations', idx)) >= 0 && n < 40) {
  const line = src.substring(Math.max(0, idx - 100), idx + 150).replace(/\n/g, ' ');
  console.log(n + ':', line);
  idx += 1;
  n++;
}

console.log('\n--- pathname quotations count:', (src.match(/\/quotations/g) || []).length);

// Find "Quotations" label in UI
idx = 0;
n = 0;
while ((idx = src.indexOf('Quotations', idx)) >= 0 && n < 25) {
  console.log('\nQuotations', n, ':', src.substring(idx - 60, idx + 80).replace(/\n/g, ' '));
  idx += 1;
  n++;
}
