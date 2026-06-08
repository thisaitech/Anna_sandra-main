const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const start = s.indexOf(',vr=()=>');
const end = s.indexOf('function F(', start);
const chunk = s.slice(start, Math.min(start + 15000, end));
// find Outlet or main
const idx = chunk.indexOf('Outlet');
console.log('Outlet at', idx);
console.log(chunk.slice(Math.max(0, idx - 200), idx + 400));
// pos specific layout
['pathname', '/pos', 'pos-layout', 'main', 'flex-1', 'h-screen', 'min-h'].forEach(t => {
  let i = chunk.indexOf(t);
  if (i >= 0) console.log('\n', t, chunk.slice(i, i + 120));
});
