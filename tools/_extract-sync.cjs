const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/index-jCsVk30s.js', 'utf8');
const keys = [
  'async function xa',
  'function Bs',
  'function Tr',
  'addEventListener("online',
  'ke=!0',
  'offline-sync-requested',
  'window.addEventListener("online',
];
for (const k of keys) {
  let i = 0;
  let c = 0;
  while ((i = s.indexOf(k, i)) !== -1 && c < 2) {
    console.log('\n---', k, '@', i);
    console.log(s.slice(Math.max(0, i - 100), i + 350));
    i++;
    c++;
  }
}
