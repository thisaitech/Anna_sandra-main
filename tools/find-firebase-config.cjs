const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const keys = ['apiKey:', 'authDomain:', 'projectId:', 'storageBucket:', 'messagingSenderId:', 'appId:', 'measurementId:'];
for (const k of keys) {
  const re = new RegExp(k + '"([^"]+)"');
  const m = s.match(re);
  console.log(k, m ? m[1] : 'NOT FOUND');
}
// find firebaseConfig object block
const idx = s.indexOf('apiKey:"');
let count = 0;
let p = 0;
while ((p = s.indexOf('apiKey:"', p + 1)) !== -1 && count < 5) {
  console.log('\nblock', count, s.slice(p, p + 350));
  count++;
}
