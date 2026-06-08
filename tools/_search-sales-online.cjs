const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
const terms = ['online', 'offline', 'navigator.onLine', 'Ce(!1)', 'pe==="create"', 'return null', 'vr('];
for (const t of terms) {
  let i = 0;
  let n = 0;
  while ((i = s.indexOf(t, i)) !== -1 && n < 5) {
    console.log(t, '@', i, ':', s.slice(Math.max(0, i - 40), i + 80).replace(/\n/g, ' '));
    i++;
    n++;
  }
}
