const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
// R and vr near routes - search pageKey
const idx = s.indexOf('pageKey:"pos"');
console.log('pageKey pos at', idx);
console.log(s.slice(idx - 2000, idx + 500));
// find vr= before routes
const vrIdx = s.lastIndexOf('function vr', idx);
const vrIdx2 = s.lastIndexOf('const vr=', idx);
console.log('vr function at', vrIdx, vrIdx2);
if (vrIdx > 0) console.log(s.slice(vrIdx, vrIdx + 800));
// find R= route guard
for (const pat of ['function R(', 'const R=', ',R=']) {
  let i = 0;
  let c = 0;
  while ((i = s.indexOf(pat, i)) !== -1 && c < 3) {
    const ctx = s.slice(i, i + 500);
    if (ctx.includes('pageKey') || ctx.includes('allowedRoles') || ctx.includes('Navigate')) {
      console.log('\nR candidate', pat, i, ctx.slice(0, 400));
      c++;
    }
    i++;
  }
}
