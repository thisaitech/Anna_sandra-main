const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
const terms = ['jd,', 'jsx(jd', 'createElement(jd', 'Suspense', 'pe===', 'viewMode', 'Ce&&', '!Ce'];
for (const t of terms) {
  let i = s.indexOf(t);
  if (i !== -1) console.log('\n', t, '@', i, '\n', s.slice(Math.max(0, i - 80), i + 200));
}
