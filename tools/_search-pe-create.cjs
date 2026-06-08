const fs = require('fs');
const s = fs.readFileSync('c:/project/Anna_sandra-main/dist/assets/Sales-DxyuXk9a.js', 'utf8');
let i = 0;
let n = 0;
while ((i = s.indexOf('pe==="create"', i)) !== -1 && n < 15) {
  console.log(n + 1, '@', i, ':', s.slice(Math.max(0, i - 60), i + 120).replace(/\n/g, ' '));
  i++;
  n++;
}
