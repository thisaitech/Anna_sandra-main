const fs = require('fs');
const s = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
let pos = 0;
let n = 0;
while ((pos = s.indexOf('xa()', pos)) >= 0 && n < 15) {
  console.log('---', n, 'at', pos, '---');
  console.log(s.slice(Math.max(0, pos - 120), pos + 80));
  pos += 4;
  n++;
}
