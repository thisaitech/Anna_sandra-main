const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
// find state declarations near Ce
for (const pat of [',Bs]=', '[Bs,', 'Ce(!0)', 'Ce(!1)', 'Bs?e', 'Xl', 'showPos']) {
  let i = 0;
  let n = 0;
  while ((i = s.indexOf(pat, i)) !== -1 && n < 6) {
    console.log(pat, '@', i, ':', s.slice(Math.max(0, i - 50), i + 100).replace(/\n/g, ' '));
    i++;
    n++;
  }
}
