const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('itemsList'));
let idx = 0, n = 0;
while (n < 8) {
  const i = src.indexOf('itemsList', idx);
  if (i < 0) break;
  console.log('\n---', n, '---\n', src.substring(Math.max(0, i - 80), i + 350));
  idx = i + 8; n++;
}
