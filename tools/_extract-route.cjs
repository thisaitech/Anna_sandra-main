const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
// Find protected route R=
const i = idx.indexOf('pageKey:"sales"');
const j = idx.lastIndexOf('const R=', i);
const k = idx.indexOf('Oo=', i - 50000);
console.log('R component:', idx.slice(j, j + 1200));
console.log('\n--- loading gate ---');
const m = idx.indexOf('isLoading');
let pos = 0, n = 0;
while ((pos = idx.indexOf('isLoading', pos)) >= 0 && n < 8) {
  const sn = idx.slice(Math.max(0,pos-80), pos+200);
  if (sn.includes('Navigate') || sn.includes('/login') || sn.includes('ei,')) {
    console.log(sn);
    console.log('---');
  }
  pos += 8; n++;
}
