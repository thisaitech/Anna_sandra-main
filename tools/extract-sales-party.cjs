const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
let idx = 0;
let n = 0;
while ((idx = s.indexOf('gd(', idx)) !== -1 && n < 5) {
  console.log('\n===', n, idx, '===');
  console.log(s.substring(idx - 200, idx + 500));
  idx += 3;
  n++;
}
