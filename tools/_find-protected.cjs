const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
// search for Navigate to login
const needle = 'to:"/login"';
let pos = idx.indexOf(needle);
while (pos >= 0) {
  console.log(idx.slice(Math.max(0, pos - 300), pos + 200));
  console.log('---');
  pos = idx.indexOf(needle, pos + 1);
  if (pos > 300000) break;
}
