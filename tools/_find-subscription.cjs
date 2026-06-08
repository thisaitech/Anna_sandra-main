const fs = require('fs');
const s = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const keys = ['addMonths', 'subscription', 'Failed to sync party', '$t(', 'sync returned false'];
for (const k of keys) {
  let pos = 0, n = 0;
  while ((pos = s.indexOf(k, pos)) >= 0 && n < 3) {
    console.log('\n', k, '#', n, 'at', pos);
    console.log(s.slice(Math.max(0, pos - 100), pos + 150));
    pos += k.length;
    n++;
  }
}
