const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
const terms = ['useLocation', 'useSearchParams', 'action', 'ModernPOS', '/pos', 'pathname', 'pageKey', 'lazy(', 'CI0vXiIv', 'posMode', 'isPos'];
for (const t of terms) {
  let i = 0;
  let n = 0;
  const hits = [];
  while ((i = s.indexOf(t, i)) !== -1 && n < 8) {
    hits.push(s.slice(Math.max(0, i - 60), i + 120));
    i++;
    n++;
  }
  if (hits.length) {
    console.log('\n===', t, 'count', n, '===');
    hits.forEach((h, j) => console.log(j + 1, h.replace(/\n/g, ' ')));
  }
}
