const fs = require('fs');
const p = 'dist/assets/index-jCsVk30s.js';
let s = fs.readFileSync(p, 'utf8');
const oldStr = 'if(At.size<4){await Hq()}if(At.size===0){';
const newStr =
  'if(At.size<4){await Hq()}if(At.size>=4){window.__SANDRA_HANDLER_MISS__=0;pe({syncStatus:navigator.onLine?"idle":"offline",lastSyncError:null})}if(At.size===0){';
if (s.includes(newStr)) {
  console.log('Already patched');
} else if (s.includes(oldStr)) {
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(p, s);
  console.log('Patched xa clear error');
} else {
  console.warn('Pattern not found');
}
