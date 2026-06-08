const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const idx = s.indexOf('window.addEventListener("online",Tr)');
console.log('Tr listener at', idx);
// find Tr=function or ,Tr= or function Tr
for (const pat of [',Tr=', 'function Tr(', 'const Tr=']) {
  let i = 0;
  let c = 0;
  while ((i = s.indexOf(pat, i)) !== -1 && c < 5) {
    console.log('\n---', pat, '@', i);
    console.log(s.slice(i, i + 400));
    i++;
    c++;
  }
}
