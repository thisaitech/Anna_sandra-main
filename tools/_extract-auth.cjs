const fs = require('fs');
const idx = fs.readFileSync('dist/assets/index-jCsVk30s.js', 'utf8');
const patterns = [
  'isAuthenticated',
  'offline-local',
  'localStorage.getItem("user")',
  'AuthProvider',
  'ce&&',
  'ce?',
  'Navigate',
  'path:"/login"',
];
for (const p of patterns) {
  let pos = 0, n = 0;
  while ((pos = idx.indexOf(p, pos)) >= 0 && n < 2) {
    console.log('\n---', p, '---');
    console.log(idx.slice(Math.max(0, pos - 150), pos + 400));
    pos += p.length;
    n++;
  }
}
