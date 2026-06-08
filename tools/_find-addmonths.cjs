const fs = require('fs');
const s = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const k = 'addMonths';
let pos = s.indexOf(k);
while (pos >= 0) {
  console.log(s.slice(Math.max(0,pos-200), pos+400));
  console.log('---');
  pos = s.indexOf(k, pos+1);
  if (pos > 500000) break;
}
