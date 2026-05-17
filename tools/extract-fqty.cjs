const fs = require('fs');
const m = JSON.parse(fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js.map', 'utf8'));
const src = m.sourcesContent.find(c => c && c.includes('formatQuantityWithUnit'));
let idx = 0;
while (true) {
  const i = src.indexOf('formatQuantityWithUnit', idx);
  if (i < 0) break;
  console.log('\n--- at', i, '---\n', src.substring(Math.max(0, i - 100), i + 400));
  idx = i + 1;
}
